import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds !== 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else {
      router.push("/");
    }
  });

  return (
    <div className="not-found">
      <h1>Ooops...</h1>
      <h2>That page cannot be found.</h2>
      <p>
        Going back to the{" "}
        <Link href="/">
          <a>homepage</a>
        </Link>
        {" "}in{" "}{seconds}...
      </p>
    </div>
  );
};

export default NotFound;
