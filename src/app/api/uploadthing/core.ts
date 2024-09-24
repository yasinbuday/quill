import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { type FileRouter, createUploadthing } from "uploadthing/next";

import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user || !user.id) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://utfs.io/f/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(`https://utfs.io/f/${file.key}`);

        if (!response.ok) {
          throw new Error("Failed to fetch PDF file");
        }

        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();
        const pagesAmt = pageLevelDocs.length;

        if (!pageLevelDocs || pageLevelDocs.length === 0) {
          throw new Error("PDFLoader failed to load any pages");
        }

        const pinecone = await getPineconeClient();
        const pineconeIndex = pinecone.Index("quillmentor");

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (err) {
        console.error("Error during PDF processing and indexing:", err);
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
