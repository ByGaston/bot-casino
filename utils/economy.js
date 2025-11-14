// utils/economy.js
const fs = require('fs').promises;
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'economy.json');

async function readFile() {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { users: {} };
  }
}

async function writeFile(data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

async function getUser(id) {
  const data = await readFile();
  if (!data.users[id]) {
    data.users[id] = { balance: 500, lastDaily: 0 };
    await writeFile(data);
  }
  return data.users[id];
}

async function saveUser(id, user) {
  const data = await readFile();
  data.users[id] = user;
  await writeFile(data);
}

module.exports = { getUser, saveUser };