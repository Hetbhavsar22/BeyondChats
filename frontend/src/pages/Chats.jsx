import { useEffect, useState } from "react"
import api from "../api/api"

export default function Chats() {

  const [emails, setEmails] = useState([])
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {

    api.get("/emails").then(res => {
      setEmails(res.data)
    })

  }, [])

  const sendReply = async () => {

    await api.post("/reply", {
      to: selected.sender,
      subject: selected.subject,
      message: reply
    })

    alert("Reply sent")

  }

  const filtered = emails.filter(e =>
    e.subject?.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <div className="flex h-full">

      {/* Email List */}

      <div className="w-1/3 border-r bg-white flex flex-col">

        <div className="p-4 border-b">

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Search emails"
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="flex-1 overflow-auto">

          {filtered.map(email => (

            <div
              key={email.id}
              onClick={() => setSelected(email)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selected?.id === email.id ? "bg-gray-100" : ""
                }`}
            >

              <div className="flex justify-between">

                <h4 className="font-semibold">
                  {email.subject}
                </h4>

              </div>

              <p className="text-sm text-gray-500">
                {email.sender}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Email Thread */}

      <div className="flex-1 flex flex-col bg-white">

        {selected ? (

          <>

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold">
                {selected.subject}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                From: {selected.sender}
              </p>

            </div>

            <div className="flex-1 overflow-auto p-6">

              <p className="whitespace-pre-line">
                {selected.body}
              </p>

            </div>

            <div className="p-6 border-t">

              <textarea
                className="w-full border rounded-lg p-3"
                placeholder="Write a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />

              <button
                className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                onClick={sendReply}
              >

                Send Reply

              </button>

            </div>

          </>

        ) : (

          <div className="flex items-center justify-center h-full text-gray-400">
            Select an email to view conversation
          </div>

        )}

      </div>

    </div>

  )

}