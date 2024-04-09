import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Resources() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-4 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Resources</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Additional materials to help you understand the future of fashion through Violet Verse's POV.
          </p>
        </div>
      </div>
      <div className="divide-y">
        <div className="grid w-full items-stretch justify-center divide-x md:grid-cols-2">
          <div className="flex flex-col items-center justify-center p-4 sm:p-8">
            <iframe
              width="640"
              height="388"
              src="https://www.loom.com/embed/1feb55eaa8984111ab5d6a0661b66e82?sid=4aa4b93c-f936-4ec5-aae5-606de06bfd69"
              frameborder="0"
              allowfullscreen
            ></iframe>
            <Button
              className="absolute inset-0 flex items-center justify-center w-full bg-gray-900 dark:bg-gray-50/50"
              variant="outline"
            >
              <PlayIcon className="w-10 h-10 fill-gray-50" />
              <span className="sr-only">Play</span>
            </Button>
          </div>
          <div className="grid gap-2 p-4 sm:p-8">
            <h3 className="text-xl font-bold">Introduction to Fashion tech as a career path.</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join  Melissa Henderson as she discusses fashion tech applications and products with leading voices in the web3  community.
            </p>
            {/* Link to YouTube playlist added here */}
            <Link href="https://www.youtube.com/watch?v=lgOsSwvabQs&list=PLZT4-JBaGj0bMJLBoNuhQiyJq1cLhAhKn">
              <a>
                <Button size="sm">Watch Video</Button>
              </a>
            </Link>
          </div>
        </div>
        {/* Other sections */}
      </div>
      {/* Downloadable Resources */}
      {/* Purchase Additional Resources */}
    </section>
  );
}

// Define other components (PlayIcon, FileTypeIcon, PresentationIcon) here

