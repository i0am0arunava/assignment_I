import { connectDB } from "./mongoClient";

export interface PollHistoryData {
  question: string;
  options: string[];
  responses: Record<string, number>;
  totalParticipants: number;
}

const COLLECTION_NAME = "poll_history";

export class PollHistoryService {
  static async savePollResult(data: PollHistoryData) {
    const db = await connectDB();
    const result = await db.collection(COLLECTION_NAME).insertOne({
      question: data.question,
      options: data.options,
      responses: data.responses,
      totalParticipants: data.totalParticipants,
      createdAt: new Date(),
      completedAt: new Date(),
    });
    return result;
  }

  static async getAllPollHistory(limit: number = 50) {
    const db = await connectDB();
    const polls = await db
      .collection(COLLECTION_NAME)
      .find()
      .sort({ completedAt: -1 })
      .limit(limit)
      .toArray();
    return polls;
  }

  static async getPollById(id: string) {
    const db = await connectDB();
    const { ObjectId } = await import("mongodb");
    const poll = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return poll;
  }

  static async deletePollHistory(id: string) {
    const db = await connectDB();
    const { ObjectId } = await import("mongodb");
    const result = await db
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async updatePollResponses(id: string, responses: Record<string, number>, totalParticipants: number) {
    const db = await connectDB();
    const { ObjectId } = await import("mongodb");
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { responses, totalParticipants, completedAt: new Date() },
      }
    );
    return result.modifiedCount === 1;
  }
}
