// Input Elements
const nameInput = document.getElementById("profile_name_input");
const imageUpload = document.getElementById("profile_image_upload");
const rankSelect = document.getElementById("ranking_badge");
const specialtySelect = document.getElementById("specialty_input");

// Card Elements
const cardName = document.getElementById("profile_card_name");
const cardImage = document.getElementById("profile_image");
const cardMagBadge = document.getElementById("mag_frame_img");
const cardRank = document.getElementById("profile_rank");
const cardSpecialty = document.getElementById("profile_specialty");
const cardWrapper = document.getElementById("card_wrapper_target");
const exportTarget = document.getElementById("export_target");

// Download Elements
const downloadBtn = document.getElementById("download_btn_action");

const hasGeneratorElements =
    nameInput && imageUpload && rankSelect && specialtySelect &&
    cardName && cardImage && cardMagBadge && cardRank && cardSpecialty &&
    cardWrapper && exportTarget && downloadBtn;

if (hasGeneratorElements) {
    const rankTone = {
        "1": { accent: "#F7EAB7", glow: "rgba(247, 234, 183, 0.35)" },
        "2": { accent: "#50E3C2", glow: "rgba(80, 227, 194, 0.35)" },
        "3": { accent: "#7ED321", glow: "rgba(126, 211, 33, 0.35)" },
        "4": { accent: "#BDFF8C", glow: "rgba(189, 255, 140, 0.35)" },
        "5": { accent: "#B8E986", glow: "rgba(184, 233, 134, 0.35)" },
        "6": { accent: "#F8E71C", glow: "rgba(248, 231, 28, 0.35)" },
        "7": { accent: "#F5A623", glow: "rgba(245, 166, 35, 0.35)" },
        "8": { accent: "#F1442E", glow: "rgba(241, 68, 46, 0.35)" },
        "9": { accent: "#55CDFC", glow: "rgba(85, 205, 252, 0.35)" }
    };

    const updateDisplayName = (value) => {
        const normalized = value.trim();
        cardName.textContent = normalized || "John Doe";
    };

    const updateRank = (rankValue) => {
        cardRank.textContent = `Mag ${rankValue}`;
        cardMagBadge.src = `mag_${rankValue}.png`;

        const selectedTone = rankTone[rankValue] || rankTone["1"];
        exportTarget.style.setProperty("--mag-accent", selectedTone.accent);
        exportTarget.style.setProperty("--mag-accent-soft", selectedTone.glow);

        cardWrapper.style.background = `
            radial-gradient(circle at 85% 15%, ${selectedTone.glow}, transparent 34%),
            radial-gradient(circle at 10% 90%, rgba(32, 125, 179, 0.25), transparent 30%),
            repeating-radial-gradient(circle at 50% 50%, rgba(136, 199, 255, 0.08) 0 2px, transparent 2px 8px),
            linear-gradient(145deg, #04152f 0%, #081f3b 50%, #031327 100%)
        `;
    };

    updateDisplayName(nameInput.value);
    cardSpecialty.textContent = specialtySelect.value;
    updateRank(rankSelect.value);

    nameInput.addEventListener("input", (e) => updateDisplayName(e.target.value));

    imageUpload.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            cardImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    rankSelect.addEventListener("change", (e) => updateRank(e.target.value));

    specialtySelect.addEventListener("change", (e) => {
        cardSpecialty.textContent = e.target.value;
    });

    downloadBtn.addEventListener("click", async () => {
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = "Preparing card...";
        downloadBtn.disabled = true;

        try {
            const width = exportTarget.offsetWidth;
            const height = exportTarget.offsetHeight;

            const dataUrl = await domtoimage.toPng(exportTarget, {
                quality: 1,
                bgcolor: "transparent",
                width: width * 2.5,
                height: height * 2.5,
                style: {
                    transform: "scale(2.5)",
                    transformOrigin: "top left",
                    width: `${width}px`,
                    height: `${height}px`
                }
            });

            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const safeName = (nameInput.value.trim() || "Seismic").replace(/\s+/g, "_");
            const link = document.createElement("a");
            link.download = `${safeName}_card.png`;
            link.href = objectUrl;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Image download failed", error);
            alert("Could not generate image. Please try again.");
        } finally {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }
    });
}
