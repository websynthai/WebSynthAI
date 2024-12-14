"use client";
import { Button } from "./ui";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserButton from "./user-button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { toggle: toggleAuth } = useAuthModal();
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="w-full bg-white flex justify-between items-center p-4">
      <div className="flex space-x-2">
        <Button
          onClick={() => router.push("/")}
          variant={"ghost"}
          className="text-xl font-bold gap-2"
        >
          <Image src="/icon.png" alt="Logo icon" width={20} height={20} />
          v0.diy
        </Button>
        <Button
          onClick={() => router.push("/explore")}
          variant={"outline"}
          className="text-xl font-semibold"
        >
          Explore
        </Button>
        <Button
          onClick={() => router.push("/changelog")}
          variant={"outline"}
          className="text-xl font-semibold"
        >
          Changelogs
        </Button>
      </div>
      <div className="flex space-x-2 items-center">
        {status === "authenticated" && (
          <Link
            href={"https://github.com/SujalXplores/v0.diy/issues/new"}
            target="_blank"
            className="text-sm font-semibold"
          >
            Bug Report / Feature Request
          </Link>
        )}
        <Button
          onClick={() => window.open("https://git.new/v0.diy")}
          variant="default"
        >
          Github
        </Button>
        {status === "unauthenticated" && (
          <Button onClick={toggleAuth} variant="default">
            Sign In
          </Button>
        )}
        {status === "authenticated" && session.user && (
          <UserButton user={session.user} />
        )}
      </div>
    </div>
  );
};

export default Header;
