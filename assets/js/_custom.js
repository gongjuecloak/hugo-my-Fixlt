/* ------------------ 跳转风险提示 ------------------ */
document.body.addEventListener('click', function (e) {
  const target = e.target.closest('.wl-cards a, .card-link, .device-link');
  if (!target) return;
  const href = target.getAttribute('href');
  if (!href) return;

  // 排除本地链接
  const isLocalLink =
    href.startsWith('#') ||
    href.startsWith('javascript:') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('/') ||
    !href.includes('://');
  if (isLocalLink) return;

  const url = new URL(target.href, window.location.href);
  const currentDomain = window.location.hostname;

  // 域名白名单（直接放行的外部域名）
  const whitelistDomains = [
    'bulone.github.io',
    'blog.toastbubble.top'
  ];

  // 检查是否在白名单中
  const isWhitelisted = whitelistDomains.some(domain =>
    url.hostname === domain || url.hostname.endsWith(`.${domain}`)
  );

  // 排除当前域名及其子域名
  const isCurrentOrSubDomain =
    url.hostname === currentDomain ||
    url.hostname.endsWith(`.${currentDomain}`);

  // 条件判断优先级：
  // 1. 白名单域名 -> 直接放行（不拦截）
  // 2. 当前域名/子域名或排除路径 -> 不处理
  // 3. 其他外部链接 -> 重定向
  if (isWhitelisted) {
    return; // 允许白名单域名正常跳转
  } else if (isCurrentOrSubDomain) {
    return; // 不处理当前域名或排除路径
  } else {
    e.preventDefault();
    const encodedUrl = btoa(target.href);
    window.open(`/redirect?url=${encodedUrl}`, '_blank');
  }
});