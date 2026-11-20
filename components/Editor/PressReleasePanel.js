import { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MAX_FILE_MB = 3;
const MAX_PHOTOS = 8;
const YOUTUBE = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
    });

// "Draft from a press release": Claude writes the article, then onDraft fills the form.
export default function PressReleasePanel({ uploadImage, onDraft }) {
    const [releaseText, setReleaseText] = useState("");
    const [releaseUrl, setReleaseUrl] = useState("");
    const [file, setFile] = useState(null);
    const [photos, setPhotos] = useState([]); // [{ url, name }]
    const [uploading, setUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [notes, setNotes] = useState("");
    const [working, setWorking] = useState(false);
    const [error, setError] = useState("");
    const [editorNotes, setEditorNotes] = useState([]);

    const addPhotos = async (files) => {
        setError("");
        const list = [...files].slice(0, MAX_PHOTOS - photos.length);
        setUploading(true);
        const added = [];
        for (const f of list) {
            const url = await uploadImage(f);
            if (url) added.push({ url, name: f.name });
            else setError(`Couldn't upload ${f.name}.`);
        }
        setPhotos((p) => [...p, ...added]);
        setUploading(false);
    };

    const makeBanner = (i) => setPhotos((p) => [p[i], ...p.filter((_, j) => j !== i)]);
    const removePhoto = (i) => setPhotos((p) => p.filter((_, j) => j !== i));

    const pickFile = (f) => {
        setError("");
        if (f && f.size > MAX_FILE_MB * 1024 * 1024) {
            setError(`That file is over ${MAX_FILE_MB} MB. Paste the text or use the link instead.`);
            return;
        }
        setFile(f || null);
    };

    const write = async () => {
        setError("");
        setEditorNotes([]);
        if (!releaseText.trim() && !releaseUrl.trim() && !file) {
            setError("Add a press release: paste it, upload it, or give its link.");
            return;
        }
        if (videoUrl.trim() && !YOUTUBE.test(videoUrl.trim())) {
            setError("That doesn't look like a YouTube link.");
            return;
        }
        setWorking(true);
        try {
            const res = await fetch("/api/ai/draftFromRelease", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    releaseText,
                    releaseUrl: releaseUrl.trim(),
                    file: file ? { name: file.name, type: file.type, base64: await toBase64(file) } : null,
                    photos: photos.map((p) => p.url),
                    videoUrl: videoUrl.trim(),
                    notes,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Claude couldn't write the draft. Try again.");
            onDraft(data);
            setEditorNotes(data.editorNotes || []);
        } catch (e) {
            setError(e.message);
        }
        setWorking(false);
    };

    return (
        <Accordion defaultExpanded sx={{ mb: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600 }}>✨ Draft from a press release</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Paste the press release"
                            multiline
                            minRows={5}
                            maxRows={14}
                            fullWidth
                            value={releaseText}
                            onChange={(e) => setReleaseText(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <TextField
                            label="…or its link"
                            placeholder="https://"
                            fullWidth
                            value={releaseUrl}
                            onChange={(e) => setReleaseUrl(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={5} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button variant="outlined" component="label" sx={{ borderRadius: "4px" }}>
                            …or upload it (PDF, Word)
                            <input
                                hidden
                                type="file"
                                accept=".pdf,.docx,.txt,.md,application/pdf"
                                onChange={(e) => pickFile(e.target.files[0])}
                            />
                        </Button>
                        {file && (
                            <Typography variant="body2" noWrap>
                                {file.name}{" "}
                                <Button size="small" onClick={() => setFile(null)}>remove</Button>
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Photos (up to {MAX_PHOTOS}). The first one is the banner; Claude places the rest in the article.
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "flex-start" }}>
                            {photos.map((p, i) => (
                                <Box key={p.url} sx={{ width: 120, textAlign: "center" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={p.url}
                                        alt={p.name}
                                        style={{
                                            width: 120,
                                            height: 80,
                                            objectFit: "cover",
                                            borderRadius: 4,
                                            outline: i === 0 && !videoUrl ? "3px solid #9c27b0" : "none",
                                        }}
                                    />
                                    <Typography variant="caption" display="block">
                                        {i === 0 && !videoUrl ? "Banner" : (
                                            <Button size="small" onClick={() => makeBanner(i)}>Make banner</Button>
                                        )}
                                        <Button size="small" color="error" onClick={() => removePhoto(i)}>✕</Button>
                                    </Typography>
                                </Box>
                            ))}
                            {photos.length < MAX_PHOTOS && (
                                <Button
                                    variant="outlined"
                                    component="label"
                                    disabled={uploading}
                                    sx={{ width: 120, height: 80, borderRadius: "4px", borderStyle: "dashed" }}
                                >
                                    {uploading ? <CircularProgress size={20} /> : "+ Add photos"}
                                    <input
                                        hidden
                                        multiple
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => addPhotos(e.target.files)}
                                    />
                                </Button>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="YouTube video (optional)"
                            placeholder="https://www.youtube.com/watch?v=…"
                            helperText="Runs at the top of the article instead of a banner photo"
                            fullWidth
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Notes for Claude (optional)"
                            placeholder="Angle, length, what to emphasize…"
                            fullWidth
                            multiline
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={write}
                            disabled={working || uploading}
                            sx={{ borderRadius: "4px" }}
                        >
                            {working ? "Writing…" : "Write draft with Claude"}
                        </Button>
                        {working && <CircularProgress size={22} />}
                        {working && (
                            <Typography variant="body2" color="text.secondary">
                                This takes about 20–40 seconds.
                            </Typography>
                        )}
                    </Grid>

                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}
                    {editorNotes.length > 0 && (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                <strong>Check before publishing:</strong>
                                <ul style={{ margin: "4px 0 0", paddingLeft: 20 }}>
                                    {editorNotes.map((n, i) => <li key={i}>{n}</li>)}
                                </ul>
                            </Alert>
                        </Grid>
                    )}
                    {!working && !error && editorNotes.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                                Claude fills in the form below and ticks Draft Post. Review it, then click Create.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}
