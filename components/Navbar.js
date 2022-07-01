import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav>
      <Link href="/">
        <a className="logo">
          <Image
            src="/Logo.png"
            alt="Violet Verse Logo"
            height={90}
            width={160}
          />
        </a>
      </Link>
      <Link href="/about">
        <a>About</a>
      </Link>
      <Link href="/ninjas">
        <a>Ninja Listing</a>
      </Link>
    </nav>
  );
};

export default Navbar;
