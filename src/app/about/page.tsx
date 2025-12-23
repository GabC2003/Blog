import { type Metadata } from "next";
import { config } from "@/lib/config";
import Link from "next/link";
import { ArrowRight, Github, Mail, MapPin, GraduationCap, Heart, Database, Send } from "lucide-react";

export const metadata: Metadata = {
    title: `About | ${config.site.title}`,
    description: `About ${config.author.name} - ${config.author.bio}`,
};

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <header className="space-y-6 mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    Hi, I am {config.author.name} <span className="inline-block animate-bounce-slow">👋</span>
                </h1>

                <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                        href={config.social.github}
                        className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <Github className="w-5 h-5" />
                        <span className="text-sm font-medium">GitHub</span>
                    </Link>
                    <a
                        href={`mailto:${config.author.email}`}
                        className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        <span className="text-sm font-medium">Email</span>
                    </a>
                    <div className="inline-flex items-center space-x-2 text-slate-400">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm font-medium">Shenzhen/HongKong/Wuxi</span>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid gap-12">
                {/* Intro Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                        <span>About Me</span>
                    </h2>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg">
                        <p>
                            Tech enthusiast,Foodie,TSLA investor.
                        </p>
                    </div>
                </section>

                {/* Education Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                        <GraduationCap className="w-6 h-6 text-blue-500" />
                        <span>Education</span>
                    </h2>
                    <div className="grid gap-4">
                        <div className="relative pl-6 border-l-2 border-blue-500">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                            <p className="font-bold text-slate-900 text-lg">Chinese University of Hong Kong</p>
                            <p className="text-slate-600">Master&apos;s Degree • 2025 - 2026</p>
                        </div>
                        <div className="relative pl-6 border-l-2 border-slate-200">
                            <p className="font-bold text-slate-800 text-lg">Harbin Institute of Technology, Shenzhen</p>
                            <p className="text-slate-500">Bachelor&apos;s Degree • 2021 - 2025</p>
                        </div>
                    </div>
                </section>

                {/* Interests Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                        <Heart className="w-6 h-6 text-red-500" />
                        <span>Interests & Hobbies</span>
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { icon: "🏀", label: "Basketball" },
                            { icon: "🏊‍♂️", label: "Swimming" },
                            { icon: "🕵️‍♂️", label: "Mystery Novels" },
                            { icon: "🎬", label: "Movies" },
                            { icon: "📸", label: "Photography" }
                        ].map((item) => (
                            <span key={item.label} className="px-4 py-2 bg-slate-50 rounded-2xl text-slate-700 border border-slate-100 flex items-center space-x-2">
                                <span>{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </span>
                        ))}
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                                <Database className="w-5 h-5 text-blue-500" />
                                <span>Languages</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["Java", "Go", "React"].map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-blue-600 shadow-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                                <Send className="w-5 h-5 text-indigo-500" />
                                <span>Backend & Infrastructure</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["MySQL", "Redis", "Kafka", "RabbitMQ", "PostgreSQL", "ElasticSearch"].map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-600">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <footer className="pt-8 border-t border-slate-100 mb-12">
                    <Link
                        href="/blog"
                        className="group inline-flex items-center space-x-2 text-blue-600 font-semibold text-lg hover:underline underline-offset-4"
                    >
                        <span>Read my blogs</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </footer>
            </div>
        </div>
    );
}
