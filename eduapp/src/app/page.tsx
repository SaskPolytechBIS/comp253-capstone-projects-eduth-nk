import Image from "next/image";

export default function Home() {
  return (
      <div className="bg-[#FFF9F9] text-black min-h-screen flex items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 items-center max-w-3xl text-center">
          <Image
              className="brightness-[1.0]"
              src="/logo.png"
              unoptimized={true}
              alt="Edu logo"
              width={348}
              height={281}
              priority
          />

          <ol className="text-sm leading-6 font-[family-name:var(--font-geist-mono)] space-y-4">
            <li>
              1. Our goal is to build a tool that helps teachers share feedback more effectively and gives students a clear way to view and understand their learning journey—supporting the principles of Building Thinking Classrooms.
            </li>
            <li>
              2. EduTh!nk bridges the gap between classroom assessment and student engagement by providing a seamless platform for teachers to offer insightful feedback and for students to revisit and grow from their learning experiences.
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
          <div className="text-black text-sm-center" >
            <ol className="text-sm leading-6 font-[family-name:var(--font-geist-mono)] space-y-4">
              <li className="text-violet-800" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>EduTh!nk Members:</li>
              <li style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Nhu Le, Reese Bohn, Duong Le, Nathan Kelly, Saif Waseem, Yuan Fang</li>
            </ol>
          </div>


          <footer className="text-sm text-gray-500 pt-8">
            ©2025 EduTh!nk.
          </footer>
        </main>
      </div>
  );
}