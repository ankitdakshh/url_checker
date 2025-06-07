class URLChecker {
  constructor() {
    this.urlInput = document.getElementById("urlInput");
    this.statusDiv = document.getElementById("status");
    this.checkTimeout = null;
    this.currentRequest = null;

    this.init();
  }

  init() {
    this.urlInput.addEventListener("input", (e) => {
      this.handleInput(e.target.value);
    });
  }

  handleInput(url) {
    // Clear previous timeout
    if (this.checkTimeout) {
      clearTimeout(this.checkTimeout);
    }

    // Cancel previous request
    if (this.currentRequest) {
      this.currentRequest.cancelled = true;
    }

    if (!url.trim()) {
      this.showStatus(
        "placeholder",
        "Enter a URL above to check its validity and existence"
      );
      return;
    }

    // Check URL format immediately
    if (!this.isValidURL(url)) {
      this.showStatus("invalid", "Invalid URL format");
      return;
    }

    this.showStatus("valid", "✅ Valid URL format");

    this.checkTimeout = setTimeout(() => {
      this.checkURLExistence(url);
    }, 1000);
  }

  isValidURL(string) {
    try {
      const url = new URL(string);
      // Check if protocol is http or https
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  async checkURLExistence(url) {
    this.showStatus(
      "checking",
      '<div class="loading"></div>Checking URL existence...'
    );

    // Create a request object to track cancellation
    const request = { cancelled: false };
    this.currentRequest = request;

    try {
      // Mock server call with random delay (500-2000ms)
      const response = await this.mockServerCall(url);

      // Check if request was cancelled
      if (request.cancelled) {
        return;
      }

      if (response.exists) {
        this.showStatus("exists", `URL exists (${response.type})`);
      } else {
        this.showStatus("not-found", " URL not found");
      }
    } catch (error) {
      if (!request.cancelled) {
        this.showStatus("invalid", " Error checking URL");
      }
    } finally {
      if (this.currentRequest === request) {
        this.currentRequest = null;
      }
    }
  }

  mockServerCall(url) {
    return new Promise((resolve) => {
      // Random delay between 500-2000ms to simulate network request
      const delay = Math.random() * 1500 + 500;

      setTimeout(() => {
        // Mock response logic
        const mockExists = Math.random() > 0.3; // 70% chance URL exists
        const mockType = Math.random() > 0.5 ? "file" : "folder";

        // Some URLs have higher chance of existing for demo
        const commonUrls = [
          "https://google.com",
          "https://github.com",
          "https://stackoverflow.com",
          "https://example.com",
        ];

        const exists =
          commonUrls.some((common) =>
            url.toLowerCase().includes(common.replace("https://", ""))
          ) || mockExists;

        resolve({
          exists: exists,
          type: exists ? mockType : null,
          url: url,
        });
      }, delay);
    });
  }

  showStatus(type, message) {
    this.statusDiv.className = `status ${type}`;
    this.statusDiv.innerHTML = message;
  }
}

// Initialize the URL checker when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new URLChecker();
});
