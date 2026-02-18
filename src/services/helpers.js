function handleError(error) {
    console.error('❌ Error:', error);

    if (error.status) {
        if (error.status === 401) {
            throw new Error('مفتاح API غير صحيح. الرجاء التحقق من الإعدادات.');
        } else if (error.status === 429) {
            throw new Error('تم تجاوز الحد المسموح. الرجاء المحاولة لاحقاً.');
        } else if (error.status === 402) {
            throw new Error('رصيد API غير كافٍ. الرجاء إعادة الشحن على OpenRouter.');
        } else if (error.status === 400) {
            throw new Error('طلب غير صحيح. قد يكون النموذج المحدد غير متاح.');
        } else {
            throw new Error(`خطأ في API: ${error.status} - ${error.message || 'خطأ غير معروف'}`);
        }
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        throw new Error('خطأ في الاتصال بالإنترنت. الرجاء التحقق من اتصالك.');
    }

    if (error.message && error.message.includes('الرجاء')) {
        throw error;
    }

    throw new Error('حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.');
}

const findValue = (obj, keys) => {
    for (const key of keys) {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
            return obj[key];
        }
    }
    return '';
};

const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }

    return date.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export {handleError, findValue, formatTimestamp};