
const feedbackForm = document.getElementById("feedbackForm");
const message = document.getElementById("message");
const feedbackList = document.getElementById("feedbackList");

// Submit feedback
if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const rating = Number(document.getElementById("rating").value);
        const comments = document.getElementById("comments").value.trim();

        // Create feedback object
        const feedback = {
            name,
            rating,
            comments,
        };

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(feedback),
            });

            const data = await response.json();

            if (response.ok) {
                message.textContent =
                    "Feedback submitted successfully!";
                feedbackForm.reset();
            } else {
                message.textContent =
                    data.message || "Failed to submit feedback";
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            message.textContent =
                "Something went wrong. Please try again.";
        }
    });
}

// Load feedback when the feedback list exists
if (feedbackList) {
    loadFeedback();
}

// Fetch and display all feedback
async function loadFeedback() {
    try {
        const response = await fetch("/api/feedback");
        const feedback = await response.json();

        if (!response.ok) {
            throw new Error(dataMessage(feedback));
        }

        if (!Array.isArray(feedback) || feedback.length === 0) {
            feedbackList.innerHTML = "<p>No feedback yet.</p>";
            return;
        }

        feedbackList.innerHTML = "";

        feedback.forEach((item) => {
            const feedbackCard = document.createElement("div");
            feedbackCard.className = "feedback-card";

            feedbackCard.innerHTML = `
                <h3></h3>
                <p><strong>Rating:</strong> ${item.rating}/5</p>
                <p><strong>Comments:</strong></p>
                <p class="feedback-comment"></p>
            `;

            // Display text safely
            feedbackCard.querySelector("h3").textContent = item.name;
            feedbackCard.querySelector(".feedback-comment").textContent =
                item.comments || "";

            // Create Delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", async () => {
                const confirmDelete = confirm(
                    "Are you sure you want to delete this feedback?"
                );

                if (!confirmDelete) return;

                try {
                    const deleteResponse = await fetch(
                        `/api/feedback/${item._id}`,
                        {
                            method: "DELETE",
                        }
                    );

                    const result = await deleteResponse.json();

                    if (!deleteResponse.ok) {
                        throw new Error(
                            result.message || "Failed to delete feedback"
                        );
                    }

                    alert("Feedback deleted successfully!");

                    // Refresh list after deletion
                    loadFeedback();
                } catch (error) {
                    console.error("Delete error:", error);
                    alert(error.message || "Failed to delete feedback");
                }
            });

            feedbackCard.appendChild(deleteButton);
            feedbackCard.appendChild(document.createElement("hr"));
            feedbackList.appendChild(feedbackCard);
        });
    } catch (error) {
        console.error("Error loading feedback:", error);
        feedbackList.innerHTML = "<p>Failed to load feedback.</p>";
    }
}

// Read an error message from the API response
function dataMessage(data) {
    return data?.message || "Failed to fetch feedback";
}
