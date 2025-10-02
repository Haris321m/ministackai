import { S3Client, PutObjectCommand , GetObjectAclCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { Readable } from "stream";

// Client initialize karo
const s3 = new S3Client({
  region: "us-east-1", // apna region likho
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFile() {
  const fileStream = fs.createReadStream("myfile.png");

  const params = {
    Bucket: "my-bucket-name",
    Key: "uploads/myfile.png",  
    Body: fileStream,
    ACL: "public-read", 
    ContentType: "image/png"
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);

    console.log("Upload response:", response);

    // v3 me aapko Location manually banana hota hai
    const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log("File URL:", url);

  } catch (err) {
    console.error("Error uploading:", err);
  }
}


// async function downloadFile(){
//     const params = {
//         Bucket : "my-busket-name",
//         Key : "uplosfd/file.png"
//     };

//     try {
//         const command = new GetObjectCommand(params);
//         const response = await s3.send(command)

//         const stream = response.Body as Readable;

//         const chunks:Buffer[] =[];
//         for await (const chunk of stream){
//             chunks.push(chunk as Buffer);
//         }

//         const fileBuffer = Buffer.concat(chunks);

//         console.log("File downloaded successfully!");
//     } catch (error) {
//         console.log("Error reading file:",error)
//     }

// }

