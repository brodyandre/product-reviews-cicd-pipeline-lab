const state = {
  allReviews: [],
  filteredReviews: [],
  selectedProductId: '',
  selectedSource: '',
  query: '',
  summary: null,
};

const elements = {
  metricsGrid: document.querySelector('#metrics-grid'),
  productPills: document.querySelector('#product-pills'),
  summaryCard: document.querySelector('#summary-card'),
  reviewsList: document.querySelector('#reviews-list'),
  sourceFilter: document.querySelector('#source-filter'),
  searchInput: document.querySelector('#search-input'),
  reviewForm: document.querySelector('#review-form'),
  submitButton: document.querySelector('#submit-button'),
  statusBanner: document.querySelector('#status-banner'),
};
const productIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const sourcePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function getSources(reviews) {
  return [...new Set(reviews.map((review) => review.source))].sort();
}

function getProducts(reviews) {
  const summary = reviews.reduce((accumulator, review) => {
    const productSummary = accumulator[review.productId] || {
      productId: review.productId,
      count: 0,
      latestReviewAt: review.createdAt,
    };

    productSummary.count += 1;
    if (new Date(review.createdAt) > new Date(productSummary.latestReviewAt)) {
      productSummary.latestReviewAt = review.createdAt;
    }

    accumulator[review.productId] = productSummary;
    return accumulator;
  }, {});

  return Object.values(summary).sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return new Date(right.latestReviewAt) - new Date(left.latestReviewAt);
  });
}

function calculateMetrics(reviews) {
  if (reviews.length === 0) {
    return [
      {
        label: 'Reviews totais',
        value: '0',
        hint: 'Nenhum feedback cadastrado.',
      },
      {
        label: 'Media geral',
        value: '0',
        hint: 'Sem notas para consolidar.',
      },
      {
        label: 'Produtos monitorados',
        value: '0',
        hint: 'Adicione uma review para iniciar.',
      },
      {
        label: 'Canal dominante',
        value: '-',
        hint: 'Sem origem predominante.',
      },
    ];
  }

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const products = getProducts(reviews);
  const sourceCounts = reviews.reduce((accumulator, review) => {
    accumulator[review.source] = (accumulator[review.source] || 0) + 1;
    return accumulator;
  }, {});
  const topSource = Object.entries(sourceCounts).sort((left, right) => {
    return right[1] - left[1];
  })[0];
  const latestReview = reviews[0];

  return [
    {
      label: 'Reviews totais',
      value: formatNumber(reviews.length),
      hint: `Ultima entrada em ${formatDate(latestReview.createdAt)}.`,
    },
    {
      label: 'Media geral',
      value: formatNumber(Number(average.toFixed(2))),
      hint: 'Consolidado de satisfacao do portifolio.',
    },
    {
      label: 'Produtos monitorados',
      value: formatNumber(products.length),
      hint: 'Diversidade de itens com feedback registrado.',
    },
    {
      label: 'Canal dominante',
      value: topSource ? topSource[0] : '-',
      hint: topSource ? `${topSource[1]} reviews nesse canal.` : 'Sem dados.',
    },
  ];
}

function ratingLabel(rating) {
  return `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderLoading(target, title, description) {
  target.innerHTML = `
    <div class="loading-state">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(description)}</span>
    </div>
  `;
}

function renderMetrics() {
  const metrics = calculateMetrics(state.allReviews);
  elements.metricsGrid.innerHTML = metrics
    .map((metric) => {
      return `
        <article class="metric-card">
          <span class="metric-card__label">${escapeHtml(metric.label)}</span>
          <strong class="metric-card__value">${escapeHtml(metric.value)}</strong>
          <span class="metric-card__hint">${escapeHtml(metric.hint)}</span>
        </article>
      `;
    })
    .join('');
}

function renderProductPills() {
  const products = getProducts(state.allReviews);

  if (products.length === 0) {
    elements.productPills.innerHTML = `
      <div class="empty-state">
        <strong>Sem produtos disponiveis.</strong>
        <span>Cadastre uma review para ativar o resumo por produto.</span>
      </div>
    `;
    return;
  }

  elements.productPills.innerHTML = products
    .map((product) => {
      const isSelected = product.productId === state.selectedProductId;
      return `
        <button
          class="product-pill"
          type="button"
          data-product-id="${escapeHtml(product.productId)}"
          aria-selected="${String(isSelected)}"
          role="tab"
        >
          ${escapeHtml(product.productId)} · ${product.count}
        </button>
      `;
    })
    .join('');
}

function renderSummary() {
  if (!state.summary) {
    elements.summaryCard.innerHTML = `
      <div class="empty-state">
        <strong>Selecione um produto.</strong>
        <span>O resumo aparece aqui assim que houver um produto ativo.</span>
      </div>
    `;
    return;
  }

  const {
    productId,
    totalReviews,
    averageRating,
    ratingDistribution,
    latestReviewAt,
  } = state.summary;
  const distributionRows = [5, 4, 3, 2, 1]
    .map((rating) => {
      const count = ratingDistribution[rating] || 0;
      const width = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

      return `
        <div class="distribution__row">
          <span>${ratingLabel(rating)}</span>
          <div class="distribution__track" aria-hidden="true">
            <div class="distribution__fill" style="width: ${width}%"></div>
          </div>
          <strong>${count}</strong>
        </div>
      `;
    })
    .join('');

  elements.summaryCard.innerHTML = `
    <div class="summary-card__headline">
      <div>
        <div class="summary-card__product">${escapeHtml(productId)}</div>
        <div class="summary-card__subtext">
          ${totalReviews} review${totalReviews === 1 ? '' : 's'} registrada${
            totalReviews === 1 ? '' : 's'
          }.
        </div>
      </div>
      <div class="summary-card__score">
        <div class="summary-card__score-value">${formatNumber(averageRating)}</div>
        <div class="summary-card__subtext">media consolidada</div>
      </div>
    </div>
    <div class="distribution">
      ${distributionRows}
    </div>
    <div class="summary-card__subtext">
      ${
        latestReviewAt
          ? `Ultima atualizacao em ${formatDate(latestReviewAt)}.`
          : 'Ainda nao existem reviews para este produto.'
      }
    </div>
  `;
}

function renderSourceFilter() {
  const sources = getSources(state.allReviews);
  const currentValue = state.selectedSource;

  elements.sourceFilter.innerHTML = [
    '<option value="">Todos</option>',
    ...sources.map((source) => {
      const selected = source === currentValue ? ' selected' : '';
      return `<option value="${escapeHtml(source)}"${selected}>${escapeHtml(source)}</option>`;
    }),
  ].join('');
}

function renderReviews() {
  if (state.filteredReviews.length === 0) {
    elements.reviewsList.innerHTML = `
      <div class="empty-state">
        <strong>Nenhuma review encontrada.</strong>
        <span>Ajuste os filtros ou registre um novo feedback.</span>
      </div>
    `;
    return;
  }

  elements.reviewsList.innerHTML = state.filteredReviews
    .map((review, index) => {
      return `
        <article class="review-card" tabindex="0" style="--delay: ${index * 40}ms">
          <div class="review-card__top">
            <div>
              <h3 class="review-card__title">${escapeHtml(review.productId)}</h3>
              <div class="review-card__meta">
                ${escapeHtml(review.customerName)} · ${escapeHtml(formatDate(review.createdAt))}
              </div>
            </div>
            <span class="rating-pill" aria-label="Nota ${review.rating} de 5">
              ${escapeHtml(ratingLabel(review.rating))}
            </span>
          </div>
          <p class="review-card__comment">${escapeHtml(review.comment)}</p>
          <div class="badge-row">
            <span class="badge">${escapeHtml(review.source)}</span>
            <span class="badge">ID: ${escapeHtml(review.id)}</span>
          </div>
        </article>
      `;
    })
    .join('');
}

function applyFilters() {
  const query = state.query.trim().toLowerCase();

  state.filteredReviews = state.allReviews.filter((review) => {
    const matchesSource =
      !state.selectedSource || review.source === state.selectedSource;
    const matchesQuery =
      !query ||
      [review.productId, review.customerName, review.comment, review.source]
        .join(' ')
        .toLowerCase()
        .includes(query);

    return matchesSource && matchesQuery;
  });

  renderReviews();
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let payload = null;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const error = new Error(
      payload?.error?.message || 'Falha ao carregar dados.'
    );
    error.payload = payload?.error || null;
    throw error;
  }

  return response.json();
}

async function refreshSummary() {
  if (!state.selectedProductId) {
    state.summary = null;
    renderSummary();
    return;
  }

  renderLoading(
    elements.summaryCard,
    'Carregando resumo...',
    'Buscando consolidado mais recente do produto selecionado.'
  );

  const payload = await fetchJson(
    `/api/products/${encodeURIComponent(state.selectedProductId)}/summary`
  );

  state.summary = payload.data;
  renderSummary();
}

function setSelectedProduct(productId) {
  state.selectedProductId = productId;
  renderProductPills();
  refreshSummary().catch((error) => {
    showStatus(error.message, 'error');
  });
}

function pickDefaultProduct() {
  if (state.selectedProductId) {
    return state.selectedProductId;
  }

  const [firstProduct] = getProducts(state.allReviews);
  return firstProduct ? firstProduct.productId : '';
}

async function loadDashboard() {
  renderLoading(
    elements.metricsGrid,
    'Montando painel...',
    'Lendo reviews e preparando o panorama da experiencia.'
  );
  renderLoading(
    elements.summaryCard,
    'Organizando o radar...',
    'Conectando os dados do produto selecionado.'
  );
  renderLoading(
    elements.reviewsList,
    'Carregando reviews...',
    'Ordenando os comentarios mais recentes.'
  );

  const payload = await fetchJson('/api/reviews');
  state.allReviews = payload.data;
  state.selectedProductId = pickDefaultProduct();
  renderMetrics();
  renderSourceFilter();
  renderProductPills();
  applyFilters();
  await refreshSummary();
}

function clearErrors() {
  document.querySelectorAll('.field--invalid').forEach((field) => {
    field.classList.remove('field--invalid');
  });

  document.querySelectorAll('[data-error-for]').forEach((message) => {
    message.textContent = '';
  });
}

function showFieldErrors(errors) {
  clearErrors();

  errors.forEach((error) => {
    const field = document.querySelector(`#${error.field}`);
    const wrapper = field?.closest('.field');
    const message = document.querySelector(`[data-error-for="${error.field}"]`);

    if (wrapper) {
      wrapper.classList.add('field--invalid');
    }

    if (message) {
      message.textContent = error.message;
    }
  });

  const firstError = errors[0];
  if (firstError) {
    document.querySelector(`#${firstError.field}`)?.focus();
  }
}

function validateForm(payload) {
  const errors = [];

  if (!payload.productId.trim()) {
    errors.push({
      field: 'productId',
      message: 'Informe o identificador do produto.',
    });
  } else if (payload.productId.trim().length < 3) {
    errors.push({
      field: 'productId',
      message: 'Use ao menos 3 caracteres no productId.',
    });
  } else if (payload.productId.trim().length > 60) {
    errors.push({
      field: 'productId',
      message: 'Use no maximo 60 caracteres no productId.',
    });
  } else if (!productIdPattern.test(payload.productId.trim())) {
    errors.push({
      field: 'productId',
      message: 'Use apenas letras, numeros e hifens no productId.',
    });
  }

  if (!payload.customerName.trim()) {
    errors.push({
      field: 'customerName',
      message: 'Informe o nome do cliente.',
    });
  } else if (payload.customerName.trim().length < 3) {
    errors.push({
      field: 'customerName',
      message: 'Use ao menos 3 caracteres no nome do cliente.',
    });
  } else if (payload.customerName.trim().length > 80) {
    errors.push({
      field: 'customerName',
      message: 'Use no maximo 80 caracteres no nome do cliente.',
    });
  }

  if (
    !Number.isInteger(payload.rating) ||
    payload.rating < 1 ||
    payload.rating > 5
  ) {
    errors.push({ field: 'rating', message: 'Escolha uma nota entre 1 e 5.' });
  }

  if (!payload.source.trim()) {
    errors.push({ field: 'source', message: 'Informe a origem da review.' });
  } else if (payload.source.trim().length < 3) {
    errors.push({
      field: 'source',
      message: 'Use ao menos 3 caracteres na origem.',
    });
  } else if (payload.source.trim().length > 40) {
    errors.push({
      field: 'source',
      message: 'Use no maximo 40 caracteres na origem.',
    });
  } else if (!sourcePattern.test(payload.source.trim())) {
    errors.push({
      field: 'source',
      message: 'Use apenas letras, numeros e hifens na origem.',
    });
  }

  if (!payload.comment.trim()) {
    errors.push({
      field: 'comment',
      message: 'Descreva a experiencia do cliente.',
    });
  } else if (payload.comment.trim().length < 10) {
    errors.push({
      field: 'comment',
      message: 'Escreva um comentario com ao menos 10 caracteres.',
    });
  } else if (payload.comment.trim().length > 500) {
    errors.push({
      field: 'comment',
      message: 'Use no maximo 500 caracteres no comentario.',
    });
  }

  return errors;
}

function readFormPayload() {
  const formData = new FormData(elements.reviewForm);

  return {
    productId: String(formData.get('productId') || ''),
    customerName: String(formData.get('customerName') || ''),
    rating: Number.parseInt(String(formData.get('rating') || ''), 10),
    source: String(formData.get('source') || ''),
    comment: String(formData.get('comment') || ''),
  };
}

let statusTimer;
function showStatus(message, tone = 'success') {
  window.clearTimeout(statusTimer);
  elements.statusBanner.textContent = message;
  elements.statusBanner.className = `status-banner status-banner--visible status-banner--${tone}`;

  statusTimer = window.setTimeout(() => {
    elements.statusBanner.className = 'status-banner';
  }, 2600);
}

async function handleSubmit(event) {
  event.preventDefault();
  clearErrors();

  const payload = readFormPayload();
  const errors = validateForm(payload);

  if (errors.length > 0) {
    showFieldErrors(errors);
    showStatus('Revise os campos destacados para continuar.', 'error');
    return;
  }

  elements.submitButton.disabled = true;
  elements.submitButton.textContent = 'Salvando...';

  try {
    const response = await fetchJson('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    state.allReviews = [response.data, ...state.allReviews];
    state.selectedProductId = response.data.productId;
    state.selectedSource = '';
    state.query = '';
    elements.searchInput.value = '';
    elements.sourceFilter.value = '';
    elements.reviewForm.reset();
    renderMetrics();
    renderSourceFilter();
    renderProductPills();
    applyFilters();
    await refreshSummary();
    showStatus('Review cadastrada com sucesso.', 'success');
  } catch (error) {
    if (Array.isArray(error.payload?.details)) {
      showFieldErrors(error.payload.details);
    }

    showStatus(error.message, 'error');
  } finally {
    elements.submitButton.disabled = false;
    elements.submitButton.textContent = 'Salvar review';
  }
}

function bindEvents() {
  elements.productPills.addEventListener('click', (event) => {
    const button = event.target.closest('[data-product-id]');

    if (!button) {
      return;
    }

    setSelectedProduct(button.dataset.productId);
  });

  elements.searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    applyFilters();
  });

  elements.sourceFilter.addEventListener('change', (event) => {
    state.selectedSource = event.target.value;
    applyFilters();
  });

  elements.reviewForm.addEventListener('submit', handleSubmit);
}

async function initialize() {
  bindEvents();

  try {
    await loadDashboard();
  } catch (error) {
    renderLoading(
      elements.metricsGrid,
      'Nao foi possivel carregar o painel.',
      error.message
    );
    renderLoading(
      elements.summaryCard,
      'Resumo indisponivel.',
      'Tente novamente em instantes.'
    );
    renderLoading(
      elements.reviewsList,
      'Lista indisponivel.',
      'Verifique a API e recarregue a pagina.'
    );
    showStatus(error.message, 'error');
  }
}

initialize();
