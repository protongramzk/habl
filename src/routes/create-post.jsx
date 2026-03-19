import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { uploadPost } from "../utils/post";

export default function CreatePost() {
  const navigate = useNavigate();

  const [caption, setCaption] = createSignal("");
  const [files, setFiles] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await uploadPost({
        caption: caption(),
        files: files(),
      });

      alert("Post berhasil 🚀");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", "max-width": "500px", margin: "0 auto" }}>
      <h2>Buat Post 🔥</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Tulis sesuatu..."
          value={caption()}
          onInput={(e) => setCaption(e.target.value)}
        />

        <div style={{ "margin-top": "10px" }}>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          disabled={loading()}
          style={{ "margin-top": "15px" }}
        >
          {loading() ? "Uploading..." : "Post"}
        </button>
      </form>

      {error() && <p style={{ color: "red" }}>{error()}</p>}
    </div>
  );
}
