import { getPostData, getSortedPostsData } from "../../../lib/posts";

/**
 * The component for a single post page.
 *
 * Retrieves the post data from the file system and renders the post as an
 * article.
 *
 * @param {{ params: { id: string } }} props - The component props.
 * @returns {JSX.Element} The rendered post page.
 */
export default async function PostPage({ params }) {
  const { id } = (await params) ?? {};

  if (!id) {
    // If the post ID is not present, return a 404 error page.
    return <div>Post not found</div>;
  }

  // Retrieve the post data from the file system.
  const postData = await getPostData(id);

  if (!postData) {
    // If the post data is not found, return a 404 error page.
    return <div>Post not found</div>;
  }

  if (!postData.title || !postData.contentHtml) {
    // If the post data is incomplete, return an error page.
    return <div>Error: Post data is incomplete</div>;
  }

  // Render the post as an article.
  return (
    <article>
      <h1>{postData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}

/**
 * Generates an array of static parameters for all posts.
 *
 * @returns {Array} An array of objects, each containing the 'id' of a post.
 */
export async function generateStaticParams() {
  // Get the sorted list of all posts
  const allPosts = getSortedPostsData();

  // Sanity check that we got an array of post data
  if (!Array.isArray(allPosts)) {
    throw new Error(
      "getSortedPostsData() did not return an array of post data."
    );
  }

  // Extract the IDs from the post data
  const postIds = allPosts.map(({ id }) => ({ id }));

  // Return the array of post IDs
  return postIds;
}