# AssemblyAI Integration - Quick Start

## ✅ Already Integrated!

AssemblyAI is **already fully integrated** in your Eden Summariser backend. You just need to add your API key.

---

## 🚀 Quick Setup (3 steps)

### 1. Get API Key

Sign up at [assemblyai.com](https://www.assemblyai.com/) and copy your API key from the dashboard.

### 2. Add to .env

```bash
cd /Users/benita/development/edensummariser/backend
echo "ASSEMBLYAI_API_KEY=your_api_key_here" >> .env
```

### 3. Restart Backend

```bash
# Stop backend (Ctrl+C), then restart:
uvicorn app.main:app --reload

# In separate terminal, start Celery:
celery -A celery_app worker --loglevel=info
```

---

## 🧪 Test It

1. Go to http://localhost:3000/record
2. Record a short test message
3. Save the recording
4. Watch Celery logs for transcription progress
5. View transcript in meetings page

---

## 📋 What's Included

- ✅ Speaker diarization (identifies different speakers)
- ✅ Timestamps for each utterance
- ✅ Automatic language detection (optional)
- ✅ Async processing via Celery
- ✅ Database storage

---

## 💰 Pricing

- **Free**: $50 in credits to start
- **Cost**: ~$0.015 per minute of audio
- **Example**: 1-hour meeting = $0.90

---

## 📚 Full Documentation

See [implementation_plan.md](file:///Users/benita/.gemini/antigravity/brain/929af174-4164-4dd3-aac2-e0fecbffa877/implementation_plan.md) for:
- Detailed setup instructions
- Troubleshooting guide
- Advanced features
- Cost estimates
