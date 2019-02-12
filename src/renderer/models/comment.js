class Comment {
  constructor(commentData) {
    this.author = commentData.author;
    this.authorId = commentData.authorId;
    this.authorThumbnail = commentData.authorThumbnails[0].url;
    this.published = commentData.publishedText;
    this.authorComment = commentData.content;
  }
}

export default Comment;
