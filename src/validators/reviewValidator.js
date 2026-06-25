const ALLOWED_FIELDS = [
  'productId',
  'customerName',
  'rating',
  'comment',
  'source',
];
const PRODUCT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const SOURCE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateStringLength(value, { field, minLength, maxLength, label }) {
  const normalizedValue = value.trim();
  const errors = [];

  if (normalizedValue.length < minLength) {
    errors.push({
      field,
      message: `${label} deve ter no minimo ${minLength} caracteres.`,
    });
  }

  if (normalizedValue.length > maxLength) {
    errors.push({
      field,
      message: `${label} deve ter no maximo ${maxLength} caracteres.`,
    });
  }

  return errors;
}

function validateCreateReviewPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return [
      {
        field: 'body',
        message: 'O corpo da requisicao deve ser um objeto JSON valido.',
      },
    ];
  }

  const errors = [];
  const unexpectedFields = Object.keys(payload).filter(
    (field) => !ALLOWED_FIELDS.includes(field)
  );

  if (unexpectedFields.length > 0) {
    errors.push({
      field: 'body',
      message: `Campos nao permitidos: ${unexpectedFields.join(', ')}.`,
    });
  }

  if (!isNonEmptyString(payload.productId)) {
    errors.push({
      field: 'productId',
      message: 'productId e obrigatorio.',
    });
  } else {
    errors.push(
      ...validateStringLength(payload.productId, {
        field: 'productId',
        minLength: 3,
        maxLength: 60,
        label: 'productId',
      })
    );

    if (!PRODUCT_ID_PATTERN.test(payload.productId.trim())) {
      errors.push({
        field: 'productId',
        message: 'productId deve usar apenas letras, numeros e hifens.',
      });
    }
  }

  if (!isNonEmptyString(payload.customerName)) {
    errors.push({
      field: 'customerName',
      message: 'customerName e obrigatorio.',
    });
  } else {
    errors.push(
      ...validateStringLength(payload.customerName, {
        field: 'customerName',
        minLength: 3,
        maxLength: 80,
        label: 'customerName',
      })
    );
  }

  if (
    typeof payload.rating !== 'number' ||
    !Number.isInteger(payload.rating) ||
    payload.rating < 1 ||
    payload.rating > 5
  ) {
    errors.push({
      field: 'rating',
      message: 'rating deve ser um inteiro entre 1 e 5.',
    });
  }

  if (!isNonEmptyString(payload.comment)) {
    errors.push({
      field: 'comment',
      message: 'comment e obrigatorio.',
    });
  } else {
    errors.push(
      ...validateStringLength(payload.comment, {
        field: 'comment',
        minLength: 10,
        maxLength: 500,
        label: 'comment',
      })
    );
  }

  if (!isNonEmptyString(payload.source)) {
    errors.push({
      field: 'source',
      message: 'source e obrigatorio.',
    });
  } else {
    errors.push(
      ...validateStringLength(payload.source, {
        field: 'source',
        minLength: 3,
        maxLength: 40,
        label: 'source',
      })
    );

    if (!SOURCE_PATTERN.test(payload.source.trim())) {
      errors.push({
        field: 'source',
        message: 'source deve usar apenas letras, numeros e hifens.',
      });
    }
  }

  return errors;
}

module.exports = { validateCreateReviewPayload };
