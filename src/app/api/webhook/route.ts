
import {and, eq, not, sql} from "drizzle-orm";
import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import  { StreamVideo } from "@/lib/stream-video";
import { NextResponse } from "next/server";
import { unknown } from "zod";


function verifySignatureWithSDK (body: string, signature: string) {
    return StreamVideo.verifyWebhook(body, signature);

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

    let payload = unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch  {
        return NextResponse.json(
            { error: "Invalid JSON" },  { status: 400 }
        );
    }


    const eventType = (payload as Record<string, unknown>)?.type;
    if (eventType === "call.session_started") {
       const event = payload as CallSessionStartedEvent;
       const meetingId = event.call.custom?.meetingId;

       if (!meetingId) {
           return NextResponse.json(
               { error: "Missing meeting ID in call session started event" }, { status: 400 }
           );
       }
        
    }

    return NextResponse.json({ status: "ok" });
}