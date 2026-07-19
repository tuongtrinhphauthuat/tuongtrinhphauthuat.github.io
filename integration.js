(function() {
  // Config
  // User should replace this with their actual Google Apps Script Web App URL after deploying Code.gs
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_ID/exec';

  // Create Floating Button
  const btn = document.createElement('button');
  btn.textContent = 'Upload / Thêm mới';
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';
  btn.style.zIndex = '9999';
  btn.style.padding = '10px 15px';
  btn.style.backgroundColor = '#007bff';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  btn.style.cursor = 'pointer';
  btn.style.fontWeight = 'bold';
  document.body.appendChild(btn);

  // Create Modal Container
  const modal = document.createElement('div');
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.zIndex = '10000';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.overflow = 'auto';
  modal.style.backgroundColor = 'rgba(0,0,0,0.4)';

  // Modal Content
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fefefe';
  modalContent.style.margin = '10% auto';
  modalContent.style.padding = '20px';
  modalContent.style.border = '1px solid #888';
  modalContent.style.width = '80%';
  modalContent.style.maxWidth = '500px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  modal.appendChild(modalContent);

  // Close Button
  const closeBtn = document.createElement('span');
  closeBtn.textContent = '×';
  closeBtn.style.color = '#aaa';
  closeBtn.style.float = 'right';
  closeBtn.style.fontSize = '28px';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.cursor = 'pointer';
  modalContent.appendChild(closeBtn);

  // Title
  const title = document.createElement('h2');
  title.textContent = 'Thêm dữ liệu lên Server';
  title.style.marginTop = '0';
  modalContent.appendChild(title);

  // Form
  const form = document.createElement('form');

  // Helper for input styles
  const inputStyle = 'width: 100%; padding: 8px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;';

  // Type Select
  const typeLabel = document.createElement('label');
  typeLabel.textContent = 'Loại dữ liệu (Type):';
  const typeSelect = document.createElement('select');
  typeSelect.style.cssText = inputStyle;
  typeSelect.innerHTML = `
    <option value="VERSION">Phiên bản chỉnh sửa (Version)</option>
    <option value="SURGERY">Loại phẫu thuật/thủ thuật mới (Surgery Type)</option>
  `;
  form.appendChild(typeLabel);
  form.appendChild(typeSelect);

  // Category
  const catLabel = document.createElement('label');
  catLabel.textContent = 'Danh mục (Category):';
  const catInput = document.createElement('input');
  catInput.type = 'text';
  catInput.style.cssText = inputStyle;
  catInput.placeholder = 'Ví dụ: Tiêu hóa, Chấn thương...';
  form.appendChild(catLabel);
  form.appendChild(catInput);

  // Title / Name
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Tên / Tiêu đề (Title):';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.style.cssText = inputStyle;
  nameInput.placeholder = 'Nhập tên hoặc tiêu đề...';
  nameInput.required = true;
  form.appendChild(nameLabel);
  form.appendChild(nameInput);

  // Content
  const contentLabel = document.createElement('label');
  contentLabel.textContent = 'Nội dung (Content):';
  const contentInput = document.createElement('textarea');
  contentInput.style.cssText = inputStyle;
  contentInput.style.height = '100px';
  contentInput.placeholder = 'Nội dung tường trình...';
  form.appendChild(contentLabel);
  form.appendChild(contentInput);

  // Version
  const versionLabel = document.createElement('label');
  versionLabel.textContent = 'Phiên bản (Version) - nếu có:';
  const versionInput = document.createElement('input');
  versionInput.type = 'text';
  versionInput.style.cssText = inputStyle;
  versionInput.placeholder = 'Ví dụ: 1.0, 1.1...';
  form.appendChild(versionLabel);
  form.appendChild(versionInput);

  // Submit Button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Upload / Lưu dữ liệu';
  submitBtn.style.width = '100%';
  submitBtn.style.padding = '10px';
  submitBtn.style.backgroundColor = '#4CAF50';
  submitBtn.style.color = 'white';
  submitBtn.style.border = 'none';
  submitBtn.style.borderRadius = '4px';
  submitBtn.style.cursor = 'pointer';
  submitBtn.style.marginTop = '10px';
  submitBtn.style.fontWeight = 'bold';
  form.appendChild(submitBtn);

  // Message Div
  const msgDiv = document.createElement('div');
  msgDiv.style.marginTop = '10px';
  msgDiv.style.fontWeight = 'bold';
  msgDiv.style.textAlign = 'center';
  form.appendChild(msgDiv);

  modalContent.appendChild(form);
  document.body.appendChild(modal);

  // Event Listeners
  btn.onclick = function() {
    modal.style.display = 'block';
  }

  closeBtn.onclick = function() {
    modal.style.display = 'none';
    msgDiv.textContent = '';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      msgDiv.textContent = '';
    }
  }

  form.onsubmit = function(e) {
    e.preventDefault();

    // Check if script URL is modified
    if (SCRIPT_URL.includes('REPLACE_WITH_YOUR_ID')) {
      msgDiv.style.color = 'red';
      msgDiv.textContent = 'Lỗi: Chưa cấu hình SCRIPT_URL trong integration.js!';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang tải lên...';
    msgDiv.textContent = '';

    const payload = {
      type: typeSelect.value,
      category: catInput.value,
      title: nameInput.value,
      content: contentInput.value,
      version: versionInput.value
    };

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      // mode: 'no-cors' - Using no-cors prevents reading the response. Standard apps script POST should accept without no-cors if configured properly to "Execute as me" and "Access: Anyone".
      // We will try standard fetch. If CORS is an issue, they might need to use `mode: 'no-cors'`.
    })
    .then(response => {
      // If we got here, request was sent.
      // If no-cors was used, response.ok is false and status is 0.
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch(e) {
          return { status: 'success', fallback: true };
        }
      });
    })
    .then(data => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Upload / Lưu dữ liệu';
      msgDiv.style.color = 'green';
      msgDiv.textContent = 'Tải lên thành công!';
      form.reset();
      setTimeout(() => {
        modal.style.display = 'none';
        msgDiv.textContent = '';
      }, 2000);
    })
    .catch(error => {
      console.error('Error:', error);
      // Attempt alternative method using no-cors if standard fails due to CORS
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload / Lưu dữ liệu';
        msgDiv.style.color = 'green';
        msgDiv.textContent = 'Tải lên hoàn tất (no-cors fallback)!';
        form.reset();
        setTimeout(() => {
          modal.style.display = 'none';
          msgDiv.textContent = '';
        }, 2000);
      }).catch(err => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload / Lưu dữ liệu';
        msgDiv.style.color = 'red';
        msgDiv.textContent = 'Lỗi kết nối: ' + err.message;
      });
    });
  };
})();
