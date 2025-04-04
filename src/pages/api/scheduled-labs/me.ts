  // // src/pages/api/scheduled-labs/me.ts
  // import type { NextApiRequest, NextApiResponse } from 'next';
  // import dbConnect from '@/utils/dbConnect';
  // import ScheduledLab from '@/models/ScheduledLab';
  // import Lab from '@/models/Lab'; // <-- Import the Lab model so it’s registered!
  // import User from '@/models/User';
  // import jwt from 'jsonwebtoken';

  // export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //   await dbConnect();

  //   if (req.method !== 'GET') {
  //     res.setHeader('Allow', ['GET']);
  //     return res.status(405).json({ message: `Method ${req.method} not allowed` });
  //   }

  //   const authHeader = req.headers.authorization;
  //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }
  //   const token = authHeader.split(' ')[1];
    
  //   let decoded: any;
  //   try {
  //     decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  //     console.log("Decoded token:", decoded);
  //   } catch (error) {
  //     return res.status(401).json({ message: 'Invalid token' });
  //   }

  //   let userId: any;
  //   if (decoded._id) {
  //     userId = decoded._id;
  //   } else if (decoded.userId) {
  //     const user = await User.findOne({ userId: decoded.userId });
  //     // console.log(user);
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  //     userId = user._id;
  //     console.log("User id found in token:", userId);
  //   } else {
  //     return res.status(400).json({ message: 'User id not found in token' });
  //   }

  //   try {
  //     // Populate the 'lab' field using the registered Lab model
  //     const scheduledLabs = await ScheduledLab.find({ bookedBy: userId, status: 'scheduled' });
  //   // .populate('lab', 'name labId');
  //     console.log("Found scheduled labs:", scheduledLabs);
  //     return res.status(200).json({ scheduledLabs });
  //   } catch (error: any) {
  //     console.error("Error fetching scheduled labs:", error);
  //     return res.status(500).json({ message: error.message });
  //   }
  // }






// // src/pages/api/scheduled-labs/me.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/utils/dbConnect";
// import ScheduledLab from "@/models/ScheduledLab";
// import Lab from "@/models/Lab"; // Ensure the Lab model is registered
// import User from "@/models/User";
// import jwt from "jsonwebtoken";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();

//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).json({ message: `Method ${req.method} not allowed` });
//   }

//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     console.log("Decoded token:", decoded);
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }

//   // Determine userId from token
//   let userId: any;
//   if (decoded._id) {
//     userId = decoded._id;
//   } else if (decoded.userId) {
//     const userFromUserId = await User.findOne({ userId: decoded.userId });
//     if (!userFromUserId) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     userId = userFromUserId._id;
//     console.log("User id found in token:", userId);
//   } else {
//     return res.status(400).json({ message: "User id not found in token" });
//   }

//   try {
//     // Retrieve the user from the database to check their role
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let scheduledLabs;
//     // If user is ICTS-Lab Manager, fetch all scheduled labs
//     if (user.role === "ICTS-Lab Manager") {
//       scheduledLabs = await ScheduledLab.find({ status: "scheduled" });
//     } else {
//       // Otherwise, fetch only labs booked by this user
//       scheduledLabs = await ScheduledLab.find({
//         bookedBy: userId,
//         status: "scheduled",
//       });
//     }

//     console.log("Found scheduled labs:", scheduledLabs);
//     return res.status(200).json({ scheduledLabs });
//   } catch (error: any) {
//     console.error("Error fetching scheduled labs:", error);
//     return res.status(500).json({ message: error.message });
//   }
// }
















// src/pages/api/scheduled-labs/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import ScheduledLab from "@/models/ScheduledLab";
import Lab from "@/models/Lab"; // Ensure the Lab model is registered
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded token:", decoded);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Determine userId from token
  let userId: any;
  if (decoded._id) {
    userId = decoded._id;
  } else if (decoded.userId) {
    const userFromUserId = await User.findOne({ userId: decoded.userId });
    if (!userFromUserId) {
      return res.status(404).json({ message: "User not found" });
    }
    userId = userFromUserId._id;
    console.log("User id found in token:", userId);
  } else {
    return res.status(400).json({ message: "User id not found in token" });
  }

  try {
    // Retrieve the user from the database to check their role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let scheduledLabs;
    // If user is ICTS-Lab Manager, fetch all scheduled labs
    if (user.role === "ICTS-Lab Manager") {
      scheduledLabs = await ScheduledLab.find({ status: "scheduled" })
        .populate("lab", "name labId")
        .populate("bookedBy", "name email");
    } else {
      // Otherwise, fetch only labs booked by this user
      scheduledLabs = await ScheduledLab.find({
        bookedBy: userId,
        status: "scheduled",
      })
        .populate("lab", "name labId")
        .populate("bookedBy", "name email");
    }

    console.log("Found scheduled labs:", scheduledLabs);
    return res.status(200).json({ scheduledLabs });
  } catch (error: any) {
    console.error("Error fetching scheduled labs:", error);
    return res.status(500).json({ message: error.message });
  }
}
