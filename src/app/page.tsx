"use client";
import MdHome from "@/markdown/home.mdx";
import Section from "@/components/Section";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
});
export default function Home() {
    return (
        <div>
            <Section className="relative">
                <Editor />
            </Section>
        </div>
    );
}
