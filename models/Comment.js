const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//create subdocument array for replies, since we will never query for just replies
const ReplySchema = new Schema(
  {
    //set up custom id to avoid confusion with parent comment _id, using the Types
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => Types.ObjectId(),
    },
    replyBody: {
      type: String,
      required: true,
      trim: true,
    },
    writtenBy: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
    },
    commentBody: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    //use replyschema to validate data for a reply
    replies: [ReplySchema], //here, replies will be nested directly in a comment's document and not reffered to like comments and pizza
  },
  {
    toJson: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// get total count of comments and replies on retrieval by making a 'virtual' field
CommentSchema.virtual('replyCount').get(function () {
  return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;
