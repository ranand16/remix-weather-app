import { prisma } from "./prisma.server"
import { json } from "@remix-run/node"

export const getMyPrefs = async (userID: string) => {
  if (userID) {
    const prefbyUserId = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      include: {
        prefs: {},
      },
    });
    return prefbyUserId;
  }

  if (!userID) {
    return json({ error: `The users doesnot have any city preferences` });
  }
};

export const createFavCity = async ({ city, byUser }) => {
  const newPref = await prisma.preferences.create({
    data: { city, byUser  },
  });
  if(!newPref){
    return json({error: 'Could not save the city'})
  }
  return json({
    message: "City preference added successfully",
    success: "true",
    payload: newPref,
  })
}
