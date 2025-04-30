import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export default function Home() {

  const allPostsData = getSortedPostsData();

  if (allPostsData.length === 0) {
    return (
      <section>
        <h1>My Blog</h1>
        <p>No posts found!!!!.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>My Blog</h1>
      <ul>
        {allPostsData.map(({ id, title, date }) => (
          <li key={id}>
            <Link href={`/posts/${id}`}>
                <h2>{title}</h2>
                <p>{date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}