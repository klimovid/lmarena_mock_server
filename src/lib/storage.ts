/**
 * In-memory storage for mock server
 * Data resets on deployment (fine for mocking)
 */

import { v4 as uuidv4 } from 'uuid';
import type { User, Chat, Turn, Message } from './types';

// Storage maps
export const users = new Map<string, User>();
export const chats = new Map<string, Chat>();
export const turns = new Map<string, Turn>();
export const messages = new Map<string, Message[]>();
export const userChats = new Map<string, string[]>(); // userId -> chatIds[]

/**
 * Create a new user
 */
export const createUser = (): User => {
  const user: User = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  
  users.set(user.id, user);
  userChats.set(user.id, []);
  
  return user;
};

/**
 * Create a new chat with initial turn
 */
export const createChat = (userId: string): { chat: Chat; turn: Turn } => {
  const chatId = uuidv4();
  const turnId = uuidv4();

  const chat: Chat = {
    id: chatId,
    userId,
    mode: 'battle',
    status: 'active',
    name: 'Untitled Chat',
    currentTurnId: turnId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const turn: Turn = {
    id: turnId,
    chatId,
    turnNumber: 1,
    status: 'waiting',
  };

  chats.set(chatId, chat);
  turns.set(turnId, turn);
  messages.set(turnId, []);
  
  // Add to user's chats
  const chatIds = userChats.get(userId) || [];
  chatIds.push(chatId);
  userChats.set(userId, chatIds);

  return { chat, turn };
};

/**
 * Get chat by ID
 */
export const getChat = (chatId: string): Chat | undefined => {
  return chats.get(chatId);
};

/**
 * Get turn by ID
 */
export const getTurn = (turnId: string): Turn | undefined => {
  return turns.get(turnId);
};

/**
 * Get all turns for a chat
 */
export const getChatTurns = (chatId: string): Turn[] => {
  const chatTurns: Turn[] = [];
  
  turns.forEach((turn) => {
    if (turn.chatId === chatId) {
      chatTurns.push(turn);
    }
  });
  
  return chatTurns.sort((a, b) => a.turnNumber - b.turnNumber);
};

/**
 * Get messages for a turn
 */
export const getTurnMessages = (turnId: string): Message[] => {
  return messages.get(turnId) || [];
};

/**
 * Add message to turn
 */
export const addMessage = (turnId: string, message: Message): void => {
  const turnMessages = messages.get(turnId) || [];
  turnMessages.push(message);
  messages.set(turnId, turnMessages);
};

/**
 * Update turn status
 */
export const updateTurnStatus = (
  turnId: string,
  status: Turn['status']
): void => {
  const turn = turns.get(turnId);
  if (turn) {
    turn.status = status;
    turns.set(turnId, turn);
  }
};

/**
 * Submit vote and reveal models
 */
export const submitVote = (
  turnId: string,
  winner: 'model_a' | 'model_b' | 'tie' | 'both_bad',
  modelA: { id: string; name: string; provider: string },
  modelB: { id: string; name: string; provider: string }
): { newTurnId: string } => {
  const turn = turns.get(turnId);
  if (!turn) {
    throw new Error('Turn not found');
  }

  // Update turn with vote and models
  turn.vote = winner;
  turn.status = 'voted';
  turn.modelA = modelA;
  turn.modelB = modelB;
  turns.set(turnId, turn);

  // Create new turn
  const newTurnId = uuidv4();
  const newTurn: Turn = {
    id: newTurnId,
    chatId: turn.chatId,
    turnNumber: turn.turnNumber + 1,
    status: 'waiting',
  };
  
  turns.set(newTurnId, newTurn);
  messages.set(newTurnId, []);

  // Update chat's current turn
  const chat = chats.get(turn.chatId);
  if (chat) {
    chat.currentTurnId = newTurnId;
    chat.updatedAt = new Date().toISOString();
    chats.set(turn.chatId, chat);
  }

  return { newTurnId };
};

/**
 * Get user's chats
 */
export const getUserChats = (userId: string): Chat[] => {
  const chatIds = userChats.get(userId) || [];
  return chatIds
    .map((id) => chats.get(id))
    .filter((chat): chat is Chat => chat !== undefined)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

