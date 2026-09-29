"use client";

import { useState, type FormEvent } from "react";

export function ContactForm({
  email,
  subject,
}: {
  email: string;
  subject: string;
}) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
      setError("Enter a valid email so Spojex can reply.");
      return;
    }
    if (message.trim().length < 8) {
      setError("Add a short message.");
      return;
    }
    const body = `Name: ${name}\nEmail: ${from}\n\n${message.trim()}`;
    const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-white p-5">
      <label className="block text-sm font-medium">
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-line px-3"
          autoComplete="name"
        />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input
          type="email"
          required
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-line px-3"
          autoComplete="email"
        />
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-1 min-h-32 w-full rounded-xl border border-line px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-alert">{error}</p> : null}
      <button type="submit" className="rounded-full bg-pitch px-5 py-3 text-sm font-semibold text-white">
        Email Spojex
      </button>
    </form>
  );
}
