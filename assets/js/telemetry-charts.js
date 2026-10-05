/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: Interactive Systems Telemetry & ApexCharts Visualizer
 * Authorities: apexcharts.js · ui-ux-pro-max-skill
 * ============================================================================
 */

(function () {
  'use strict';

  function renderSvgFallback(container, svgMarkup) {
    if (container && !container.hasChildNodes()) {
      container.innerHTML = svgMarkup;
    }
  }

  function initTelemetryCharts() {
    const latencyEl = document.querySelector('#chart-latency');
    const uptimeEl = document.querySelector('#chart-uptime');
    const throughputEl = document.querySelector('#chart-throughput');

    // SVG Fallbacks in case ApexCharts CDN is blocked or offline
    const svgLatencyFallback = `
      <svg viewBox="0 0 320 120" style="width: 100%; height: 120px; overflow: visible;">
        <defs>
          <linearGradient id="grad-latency" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00F2FE" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#00F2FE" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="M0,70 Q25,60 50,75 T100,55 T150,80 T200,50 T250,65 T300,45 L320,50 L320,120 L0,120 Z" fill="url(#grad-latency)" />
        <path d="M0,70 Q25,60 50,75 T100,55 T150,80 T200,50 T250,65 T300,45 L320,50" fill="none" stroke="#00F2FE" stroke-width="2.5" />
      </svg>
    `;

    const svgUptimeFallback = `
      <svg viewBox="0 0 320 120" style="width: 100%; height: 120px; overflow: visible;">
        <path d="M0,40 H60 V35 H120 V45 H180 V30 H240 V35 H320" fill="none" stroke="#10B981" stroke-width="2.5" />
      </svg>
    `;

    const svgThroughputFallback = `
      <svg viewBox="0 0 320 120" style="width: 100%; height: 120px; overflow: visible;">
        <rect x="10" y="80" width="22" height="40" rx="3" fill="#E6AF5C" opacity="0.6"/>
        <rect x="50" y="65" width="22" height="55" rx="3" fill="#E6AF5C" opacity="0.7"/>
        <rect x="90" y="50" width="22" height="70" rx="3" fill="#E6AF5C" opacity="0.8"/>
        <rect x="130" y="42" width="22" height="78" rx="3" fill="#E6AF5C" opacity="0.85"/>
        <rect x="170" y="30" width="22" height="90" rx="3" fill="#E6AF5C" opacity="0.9"/>
        <rect x="210" y="24" width="22" height="96" rx="3" fill="#E6AF5C" opacity="0.95"/>
        <rect x="250" y="15" width="22" height="105" rx="3" fill="#E6AF5C" opacity="1"/>
        <rect x="290" y="10" width="22" height="110" rx="3" fill="#E6AF5C" opacity="1"/>
      </svg>
    `;

    if (typeof ApexCharts === 'undefined') {
      console.log('[Telemetry] ApexCharts library not loaded. Telemetry rendering pure SVG fallbacks.');
      renderSvgFallback(latencyEl, svgLatencyFallback);
      renderSvgFallback(uptimeEl, svgUptimeFallback);
      renderSvgFallback(throughputEl, svgThroughputFallback);
      return;
    }

    // Chart 1: Bot Response Latency Distribution
    if (latencyEl) {
      const optionsLatency = {
        series: [{
          name: 'Internal Routing (ms)',
          data: [42, 45, 38, 41, 48, 36, 44, 40, 39, 43, 37, 41]
        }],
        chart: {
          type: 'area',
          height: 160,
          sparkline: { enabled: true },
          animations: { enabled: true, easing: 'easeinout', speed: 800 }
        },
        stroke: { curve: 'smooth', width: 2, colors: ['#00F2FE'] },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.02,
            stops: [0, 95, 100],
            colorStops: [
              { offset: 0, color: '#00F2FE', opacity: 0.4 },
              { offset: 100, color: '#00F2FE', opacity: 0 }
            ]
          }
        },
        tooltip: {
          theme: 'dark',
          y: { formatter: (val) => val + ' ms' }
        }
      };
      new ApexCharts(latencyEl, optionsLatency).render();
    }

    // Chart 2: Platform Uptime SLA & Zero-Downtime Failover Speed
    if (uptimeEl) {
      const optionsUptime = {
        series: [{
          name: 'System Uptime (%)',
          data: [99.98, 99.99, 99.95, 100.0, 99.97, 99.99, 100.0, 99.98]
        }],
        chart: {
          type: 'line',
          height: 160,
          sparkline: { enabled: true }
        },
        stroke: { curve: 'stepline', width: 2, colors: ['#10B981'] },
        tooltip: {
          theme: 'dark',
          y: { formatter: (val) => val + ' %' }
        }
      };
      new ApexCharts(uptimeEl, optionsUptime).render();
    }

    // Chart 3: Autonomous Web Architecture Throughput
    if (throughputEl) {
      const optionsThroughput = {
        series: [{
          name: 'Active Capsule Sessions',
          data: [120, 180, 240, 310, 420, 480, 560, 620]
        }],
        chart: {
          type: 'bar',
          height: 160,
          sparkline: { enabled: true }
        },
        plotOptions: {
          bar: { borderRadius: 3, columnWidth: '55%' }
        },
        colors: ['#E6AF5C'],
        tooltip: {
          theme: 'dark',
          y: { formatter: (val) => val + ' capsules' }
        }
      };
      new ApexCharts(throughputEl, optionsThroughput).render();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelemetryCharts);
  } else {
    initTelemetryCharts();
  }
})();
