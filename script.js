const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const transcript = document.getElementById("transcript");

const status = document.getElementById("status");
const statusDot = document.getElementById("statusDot");

const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");

const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const sentenceCount = document.getElementById("sentenceCount");


// Check browser support
const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    status.textContent =
        "Speech Recognition is not supported in this browser.";

    startBtn.disabled = true;

} else {

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";


    // Start recognition
    startBtn.addEventListener("click", () => {

        finalTranscript = transcript.value;

        recognition.start();

        startBtn.disabled = true;
        stopBtn.disabled = false;

        status.textContent = "Listening... Speak now 🎤";
        statusDot.style.background = "#ef4444";

    });


    // Stop recognition
    stopBtn.addEventListener("click", () => {

        recognition.stop();

        startBtn.disabled = false;
        stopBtn.disabled = true;

        status.textContent = "Recording stopped";
        statusDot.style.background = "#22c55e";

    });


    // Speech recognition result
    recognition.onresult = (event) => {

        let interimTranscript = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const text = event.results[i][0].transcript;

            if (event.results[i].isFinal) {

                finalTranscript += text + " ";

            } else {

                interimTranscript += text;

            }
        }

        transcript.value =
            finalTranscript + interimTranscript;

        updateAnalysis();
    };


    // Recognition ended
    recognition.onend = () => {

        startBtn.disabled = false;
        stopBtn.disabled = true;

        status.textContent = "Ready to record";
        statusDot.style.background = "#22c55e";

    };


    // Error handling
    recognition.onerror = (event) => {

        console.log("Recognition error:", event.error);

        status.textContent =
            "Error: " + event.error;

        startBtn.disabled = false;
        stopBtn.disabled = true;

    };
}


// Update text analysis
function updateAnalysis() {

    const text = transcript.value.trim();

    // Character count
    charCount.textContent = text.length;

    // Word count
    if (text === "") {

        wordCount.textContent = "0";

    } else {

        const words = text.split(/\s+/);
        wordCount.textContent = words.length;

    }

    // Sentence count
    if (text === "") {

        sentenceCount.textContent = "0";

    } else {

        const sentences = text
            .split(/[.!?]+/)
            .filter(sentence => sentence.trim().length > 0);

        sentenceCount.textContent = sentences.length;

    }
}


// Copy text
copyBtn.addEventListener("click", async () => {

    const text = transcript.value;

    if (!text.trim()) {
        alert("There is no text to copy.");
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        alert("Text copied successfully!");

    } catch (error) {

        alert("Unable to copy text.");

    }

});


// Clear text
clearBtn.addEventListener("click", () => {

    transcript.value = "";

    updateAnalysis();

    status.textContent = "Ready to record";

});


// Download text
downloadBtn.addEventListener("click", () => {

    const text = transcript.value;

    if (!text.trim()) {

        alert("There is no text to download.");

        return;
    }

    const blob = new Blob(
        [text],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "ASR_Transcription.txt";

    link.click();

    URL.revokeObjectURL(url);

});