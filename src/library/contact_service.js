const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log(data);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  } catch (error) {
    console.error(error);
    alert('Failed to send message');
  }
};
