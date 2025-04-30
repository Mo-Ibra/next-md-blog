import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * Retrieves and sorts post data from markdown files in the posts directory.
 * 
 * @returns {Array} Sorted array of post data objects by date in descending order.
 */
export function getSortedPostsData() {
  // Read all filenames from the posts directory
  const postFileNames = fs.readdirSync(postsDirectory);

  // Map over each file to extract its data
  const allPostsData = postFileNames.map((postFileName) => {
    // Remove the file extension to get the post ID
    const postId = postFileName.replace(/\.md$/, '');
    
    // Construct the full path of the file
    const postFullPath = path.join(postsDirectory, postFileName);
    
    // Read the file content
    const postContent = fs.readFileSync(postFullPath, 'utf8');
    
    // Use gray-matter to parse the post metadata section
    const { data } = matter(postContent);

    // Return an object containing the ID and metadata
    return {
      id: postId,
      ...data,
    };
  });

  // Sort posts by date in descending order
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}


/**
 * Retrieves post data for a given post ID from a markdown file.
 * 
 * @param {string} postId - The ID of the post to retrieve.
 * @returns {Promise<Object>} An object containing the post ID, HTML content, and metadata.
 */
export async function getPostData(postId) {
  // Construct the full path to the markdown file for the given post ID
  const postFullPath = path.join(postsDirectory, `${postId}.md`);
  
  // Read the content of the markdown file
  const postContent = fs.readFileSync(postFullPath, 'utf8');

  // Parse the post metadata and content using gray-matter
  const { data, content } = matter(postContent);

  // Process the markdown content to HTML using remark
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  // Return an object containing the post ID, HTML content, and metadata
  return {
    id: postId,
    contentHtml,
    ...data,
  };
}
