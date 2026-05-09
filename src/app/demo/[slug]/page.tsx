import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { demoInvitationData } from "@/lib/demo-data";
import DemoClient from "./DemoClient";

export async function generateMetadata(
  props: PageProps<"/demo/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const supabase = await createClient();
  const { data: template } = await supabase
    .from("templates")
    .select("name, description")
    .eq("slug", slug)
    .single();

  return {
    title: template ? `Demo: ${template.name}` : "Demo Template",
    description: template?.description ?? "Preview undangan digital MyPromise",
  };
}

export default async function DemoPage(props: PageProps<"/demo/[slug]">) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const guestName = typeof searchParams.to === "string" ? decodeURIComponent(searchParams.to.replace(/\+/g, " ")) : undefined;

  const supabase = await createClient();
  const { data: template } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-charcoal-800 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Template Tidak Ditemukan
          </h1>
          <p className="text-charcoal-400 mb-6">Template yang Anda cari tidak tersedia.</p>
          <a href="/templates" className="px-6 py-3 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-400 transition-all">
            Lihat Template Lain
          </a>
        </div>
      </div>
    );
  }

  return <DemoClient slug={slug} guestName={guestName} data={demoInvitationData} templateName={template.name} />;
}
