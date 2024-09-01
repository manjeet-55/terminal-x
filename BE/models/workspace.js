import mongoose from 'mongoose';

const commandSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const workspaceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  commands: [commandSchema],
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;
