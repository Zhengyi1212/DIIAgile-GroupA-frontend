<template>
    <div class="email-container">
      <h1>Admin Email Center</h1>
      <div class="email-list">
        <div v-for="(email, index) in emails" :key="index" class="email-item">
          <div class="email-header">
            <span class="sender">{{ email.sender }}</span>
            <span class="date">{{ email.date }}</span>
          </div>
          <div class="subject">{{ email.subject }}</div>
          <div class="preview">{{ email.preview }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        emails: [
          {
            sender: "System Admin",
            date: "2023-08-20",
            subject: "System Maintenance Notice",
            preview: "There will be a system maintenance on..."
          },
          {
            sender: "User Support",
            date: "2023-08-19",
            subject: "Your Recent Ticket Update",
            preview: "Regarding your recent inquiry about..."
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .email-container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .email-list {
    margin-top: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .email-item {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
  }
  
  .email-item:last-child {
    border-bottom: none;
  }
  
  .email-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .sender {
    font-weight: 600;
    color: #005792;
  }
  
  .date {
    color: #666;
    font-size: 0.9rem;
  }
  
  .subject {
    font-weight: 500;
    margin-bottom: 0.3rem;
  }
  
  .preview {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  </style>