import { type FormEvent, useCallback, useState } from "react"
import { Button } from "./Button"

// const CONTACT_FORM_LAST_SUBMITTED_DATE = "contact-form-last-submitted-date"

// const checkIfWasSubmitted = () => {
//   // on server there is no localStorage
//   if (typeof localStorage === "undefined") {
//     return false
//   }
//   const now = Date.now()
//   const periodDisabled = 24 * 60 * 60 * 1000
//   const then = localStorage.getItem(CONTACT_FORM_LAST_SUBMITTED_DATE)
//     ? parseInt(localStorage.getItem(CONTACT_FORM_LAST_SUBMITTED_DATE) as string)
//     : 0
//   const periodDisabledElapsed = now - then < periodDisabled
//   return periodDisabledElapsed
// }

const FUNCTION_URL =
  "https://europe-central2-vetblog.cloudfunctions.net/send_mail"
// const FUNCTION_URL = "http://localhost:8080/"

const sendEmail = async (
  name: string,
  email: string,
  topic: string,
  message: string,
  authToken: string
) => {
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subject: topic,
        message: message,
        to: {
          name: name,
          email: email
        }
      })
    })
  } catch (err) {
    console.error(err)
    return 0
  }
  return 1
}

type ContactFormProps = {
  authToken: string
}

export const ContactForm = ({ authToken }: ContactFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)

      const name = formData.get("name") as string
      const email = formData.get("email") as string
      const topic = formData.get("topic") as string
      const message = formData.get("message") as string

      const result = await sendEmail(name, email, topic, message, authToken)
      if (result) {
        // localStorage.setItem(
        //   CONTACT_FORM_LAST_SUBMITTED_DATE,
        //   Date.now().toString()
        // )
        setError(false)
        setIsSubmitted(true)
      } else {
        setError(true)
      }
      setIsSubmitted(true)
    },
    [authToken]
  )

  return (
    <form className="min-w-full" onSubmit={onSubmit}>
      <div className="flex flex-col mb-1 w-full">
        <label htmlFor="name">Imię</label>
        <input
          className="px-1 text-black"
          type="text"
          id="name"
          name="name"
          placeholder="Rex"
          autoComplete="username"
          disabled={isSubmitted}
          required
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="email">Email</label>
        <input
          className="px-1 text-black"
          type="email"
          id="email"
          name="email"
          placeholder="example@email.com"
          autoComplete="email"
          disabled={isSubmitted}
          required
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="topic">Temat</label>
        <input
          className="px-1 text-black"
          type="text"
          id="topic"
          name="topic"
          placeholder="Współpraca"
          autoComplete="on"
          disabled={isSubmitted}
          required
        />
      </div>
      <div className="flex flex-col mb-2">
        <label htmlFor="message">Wiadomość</label>
        <textarea
          className="px-1 text-black"
          id="message"
          name="message"
          rows={4}
          autoComplete="on"
          disabled={isSubmitted}
          required
        ></textarea>
      </div>
      <Button type="submit" disabled={isSubmitted}>
        {error
          ? "Coś poszło nie tak 😥"
          : isSubmitted
            ? "Wiadomość wysłana ✔"
            : "Wyślij"}
      </Button>
    </form>
  )
}
