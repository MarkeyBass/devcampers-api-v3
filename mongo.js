db.posts.insert({
  title: "Post 1",
  body: "Body of post 1",
  category: "News",
  likes: 4,
  tags: ["news", "events"],
  user: { name: "Mr. x", status: "asmin" },
  date: Date(),
});

db.posts.insertMany([
  {
    title: "Post 2",
    body: "Body of post 2",
    category: "News",
    likes: 4,
    tags: ["news", "events"],
    user: { name: "Mr. Y", status: "asmin" },
    date: Date(),
  },
  {
    title: "Post 1",
    body: "Body of post 1",
    category: "News",
    likes: 4,
    tags: ["news", "events"],
    user: { name: "Mr. Z", status: "asmin" },
    date: Date(),
  },
]);
db.posts.insertMany([
  {
    title: "Post 5",
    body: "Body of post 5",
    category: "Events",
    likes: 4,
    tags: ["news", "events"],
    user: { name: "Mr. Y", status: "asmin" },
    date: Date(),
  },
  {
    title: "Post 6",
    body: "Body of post 6",
    category: "Shows",
    likes: 4,
    tags: ["news", "events"],
    user: { name: "Mr. Z", status: "asmin" },
    date: Date(),
  },
]);
