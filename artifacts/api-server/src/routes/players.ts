import { Router } from "express";
import { db, playersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/players/register", async (req, res) => {
  const { username, email, password, region } = req.body;
  if (!username || !email || !password || !region) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const existing = await db
      .select({ id: playersTable.id })
      .from(playersTable)
      .where(eq(playersTable.email, email))
      .limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered." });
    }
    const [player] = await db
      .insert(playersTable)
      .values({ username, email, password, region })
      .returning();
    return res.status(201).json({
      id: player.id,
      username: player.username,
      region: player.region,
      score: player.score,
      wins: player.wins,
      losses: player.losses,
      avatarId: player.avatarId,
      avatarIcon: player.avatarIcon,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Server error." });
  }
});

router.post("/players/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const [player] = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.email, email))
      .limit(1);
    if (!player || player.password !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    return res.json({
      id: player.id,
      username: player.username,
      region: player.region,
      score: player.score,
      wins: player.wins,
      losses: player.losses,
      avatarId: player.avatarId,
      avatarIcon: player.avatarIcon,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Server error." });
  }
});

router.patch("/players/:id/score", async (req, res) => {
  const id = Number(req.params.id);
  const { won, avatarId, avatarIcon } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid player id." });
  try {
    const [player] = await db
      .select({ wins: playersTable.wins, losses: playersTable.losses, score: playersTable.score })
      .from(playersTable)
      .where(eq(playersTable.id, id))
      .limit(1);
    if (!player) return res.status(404).json({ error: "Player not found." });

    const [updated] = await db
      .update(playersTable)
      .set({
        wins: player.wins + (won ? 1 : 0),
        losses: player.losses + (won ? 0 : 1),
        score: player.score + (won ? 100 : 10),
        ...(avatarId ? { avatarId } : {}),
        ...(avatarIcon ? { avatarIcon } : {}),
      })
      .where(eq(playersTable.id, id))
      .returning();
    return res.json({
      id: updated.id,
      score: updated.score,
      wins: updated.wins,
      losses: updated.losses,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Server error." });
  }
});

export default router;
