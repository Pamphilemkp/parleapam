import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {and, eq, not} from "drizzle-orm";
import {
    MessageNewEvent,
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallRecordingReadyEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import  { streamVideo } from "@/lib/stream-video";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import  { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";

const openAiClient = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY!,
});

function verifySignatureWithSDK (body: string, signature: string) {
    return streamVideo.verifyWebhook(body, signature);

}

export async function POST(req: Request) {
    const apiKey =  req.headers.get("x-api-key");
    const signature = req.headers.get("x-signature");

    if (!signature || !apiKey) {
        return NextResponse.json(
            { error: "Missing signature or API key" },
            { status: 400 }
        );
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 401 }
        );
    }

    let payload: Record<string, unknown>;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch  {
        return NextResponse.json(
            { error: "Invalid JSON" },  { status: 400 }
        );
    }


    const eventType = ((payload as unknown) as Record<string, unknown>)?.type;
    if (eventType === "call.session_started") {
       const event = (payload as unknown) as CallSessionStartedEvent;
       const meetingId = event.call.custom?.meetingId;

       if (!meetingId) {
           return NextResponse.json(
               { error: "Missing meeting ID in call session started event" }, { status: 400 }
           );
       }
        
        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(and(
                eq(meetings.id, meetingId),
                not(eq(meetings.status, "completed")),
                not(eq(meetings.status, "active")),
                not(eq(meetings.status, "cancelled")),
                not(eq(meetings.status, "processing"))
            ));

        if (!existingMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" }, { status: 404 }
            );
        }


        await db
            .update(meetings)
            .set({ 
                status: "active",
                startedAt: new Date()
             })
            .where(eq(meetings.id, meetingId));


        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json(
                { error: "Agent not found" }, { status: 404 }
            );
        }

        const call = streamVideo.video.call("default", meetingId);
        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPEN_AI_API_KEY!,
            agentUserId: existingAgent.id,

        });

        // Enhanced instructions for teaching with whiteboard integration
        const enhancedInstructions = `${existingAgent.instructions}

IMPORTANT: You have access to an interactive whiteboard and a lightweight visual rendering system during this meeting. When teaching, explaining concepts, demonstrating formulas, or showing visual examples, you should:
1. Explicitly mention when you want to use the whiteboard (e.g., "Let me demonstrate this on the whiteboard", "I'll draw this formula", "Let me show you visually")
2. Use phrases like "demonstrate", "show on the whiteboard", "draw", "explain visually", "illustrate", "formula", "diagram", "graph" when you want to use the whiteboard
3. Be proactive in using the whiteboard for:
   - Mathematical formulas and equations
   - Chemical formulas and reactions
   - Diagrams and flowcharts
   - Graphs and charts
   - Step-by-step visual explanations
   - Physical principles and demonstrations

Visual Rendering Guidelines:
- NEVER respond with "I cannot draw" or "I can’t visually show that". Always provide a visual aid suggestion.
- Whenever possible, describe or generate lightweight visuals (diagrams, comparisons, timelines, concept maps) using concise text.
- Summaries should include visual metaphors or easy-to-follow bullet points to mirror what is rendered on screen.

When you want to use the whiteboard, say phrases like:
- "Let me demonstrate this on the whiteboard"
- "I'll draw the formula for you"
- "Let me show you visually"
- "I'll create a diagram to explain"
- "Let me plot this on a graph"

The whiteboard will automatically open when you mention these teaching keywords.`;

        realtimeClient.updateSession({
            instructions: enhancedInstructions,
        });
        
        // Listen to OpenAI Realtime events for transcriptions
        // Note: Stream's OpenAI integration handles this internally, but we can add custom handlers
        // For now, transcriptions will be available via Stream's transcript API after the call

    } else if (eventType === "call.session_participant_left") {
        const event = payload as unknown as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1]; // becasuse is formated as type:id

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting ID in participant left event" }, { status: 400 }
            );
        }

        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    }

    else if (eventType === "call.session_ended") {
        const event = payload as unknown as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting ID in session ended event" }, { status: 400 }
            );
        }

        await db
            .update(meetings)
            .set({
                status: "processing",
                endedAt: new Date(),
            })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
    }
    else if( eventType === "call.transcription_ready") {
        const event = payload as unknown as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1]; // because it is formatted as type:id

        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url,
                status: "completed",
            })
            .where(eq(meetings.id, meetingId))
            .returning();
        if (!updatedMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" }, { status: 404 }
            );
        }
            //  Call Ingest to summarize the transcript
            await inngest.send({
                name: "meetings/processing",
                data: {
                    meetingId: updatedMeeting.id,
                    transcriptUrl: updatedMeeting.transcriptUrl,
                },
            })

    }

    else if (eventType === "call.recording_ready") {
        const event = payload as unknown as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1]; // because it is formatted as type:id

         await db
            .update(meetings)
            .set({
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId))
    } else if (eventType === "message.new") {
        const event = payload as unknown as MessageNewEvent;
        const userId = event.user?.id;
        const channelId = event.channel_id;
        const text = event.message?.text;

        if (!userId || !channelId || !text) {
            return NextResponse.json(
                { error: "Missing user ID, channel ID or message text" }, { status: 400 }
            );
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

        if (!existingMeeting) {
            return NextResponse.json(
                { error: "Meeting not found or not completed" }, { status: 404 }
            );
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));
        if (!existingAgent) {
            return NextResponse.json(
                { error: "Agent not found" }, { status: 404 }
            );
        }

        if(userId !== existingAgent.id) {
           const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
      `;

      const channel = streamChat.channel("messaging", channelId);
        await channel.watch();
        const previousMessages = await channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map<ChatCompletionMessageParam>(msg => ({
            role: msg.user?.id === existingAgent.id ? "assistant" : "user",
            content: msg.text || "",
        }));

        const getResponse = await openAiClient.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: instructions},
                ...previousMessages,
                { role: "user", content: text },
            ],
        });

        const GPTResponseText = getResponse.choices[0].message?.content;
        if (!GPTResponseText) {
            return NextResponse.json(
                { error: "No response from GPT" }, { status: 400 }
            );
        }
        const avatarUrl = generateAvatarUri({
            seed: existingAgent.name,
            variant: "botttsNeutral",
        });

        streamChat.upsertUser({
            id: existingAgent.id,
            name: existingAgent.name,
            image: avatarUrl,
        });

        channel.sendMessage({
            text: GPTResponseText,
            user: {
                id: existingAgent.id,
                name: existingAgent.name,
                image: avatarUrl,
            },
        });
    }
    }

    return NextResponse.json({ status: "ok" });
}
