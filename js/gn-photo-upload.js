jQuery(function ($) {
    const debugEnabled = window.gnPhotoData && gnPhotoData.debug === true;
    const log = (...args) => { if (debugEnabled) console.debug('[GN Photo]', ...args); };

    function uploadForm(form) {
        const statusEl = $(form).find('.gn-upload-status');
        const data = new FormData(form);
        data.append('ajax', '1');
        const url = form.getAttribute('action') || form.action;
        statusEl.text('Γίνεται μεταφόρτωση...');
        log('Sending upload to', url);
        fetch(url, { method: 'POST', body: data, credentials: 'same-origin' })
            .then(res => res.json())
            .then(resp => {
                log('Upload response', resp);
                if (resp.success) {
                    const loc = resp.data && resp.data.title ? ' για ' + resp.data.title : '';
                    statusEl.text('Η μεταφόρτωση παραλήφθηκε' + loc + ' και αναμένει έγκριση.');
                    form.reset();
                } else {
                    statusEl.text('Σφάλμα κατά τη μεταφόρτωση του αρχείου.');
                }
            })
            .catch(err => {
                log('Upload error', err);
                statusEl.text('Σφάλμα κατά τη μεταφόρτωση του αρχείου.');
            });
    }

    $(document).on('click', '.gn-photo-button', function (e) {
        e.preventDefault();
        log('Upload button clicked');
        $(this).closest('form').find('.gn-photo-file').trigger('click');
    });

    $(document).on('submit', '.gn-photo-upload-form', function (e) {
        e.preventDefault();
        uploadForm(this);
    });

    $(document).on('change', '.gn-photo-file', function () {
        const form = $(this).closest('form')[0];
        uploadForm(form);
    });
});
