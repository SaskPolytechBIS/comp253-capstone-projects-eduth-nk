import Image from "next/image";

export default function Home() {
  return (
      <div className="bg-amber-50 text-black min-h-screen flex items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 items-center max-w-3xl text-center">
          <Image
              className="invert-[.05] brightness-[1.1]"
              src="/logo.png"
              alt="Edu logo"
              width={280}
              height={68}
              priority
          />

          <ol className="text-sm leading-6 font-[family-name:var(--font-geist-mono)] space-y-4">
            <li>
              The Project is to create an application to complement the assessment portion of the Building Thinking Classrooms
              framework that allows teachers to provide feedback and the student to review.
            </li>
          </ol>

          <div className="flex gap-4 flex-col sm:flex-row items-center">
            <a
                className="bg-violet-700 rounded-full border border-transparent transition-colors
                flex items-center justify-center bg-black text-white gap-2 hover:bg-[#383838]
                dark:hover:bg-[#3B82F6] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                href="./login"
                target="_blank"
                rel="noopener noreferrer"
            >
              Login Now
            </a>
          </div>

          <footer className="text-sm text-gray-500 pt-8">
            ©2025 EduTh!nk. All rights reserved.
          </footer>
        </main>
      </div>
  );
}