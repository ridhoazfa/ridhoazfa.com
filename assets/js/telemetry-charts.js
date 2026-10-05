/**
 * ============================================================================
 * CODAXIOM ENTERPRISE: RIDHO AZFA SOVEREIGN 3D PORTFOLIO
 * Component: Interactive Systems Telemetry & ApexCharts Visualizer
 * Authorities: apexcharts.js · ui-ux-pro-max-skill
 * ============================================================================
 */

(function () {
  'use strict';

  // Watchdog timer (Ponytail Law)
  const watchdog = setTimeout(() => {}, 25000);
  watchdog.unref();

  window.addEventListener('DOMContentLoaded', () => {
    if (typeof ApexCharts === 'undefined') {
      console.log('[Telemetry] ApexCharts library not loaded. Telemetry will render pure SVG fallbacks.');
      return;
    }

    // Chart 1: Bot Response Latency Distribution
    const latencyEl = document.querySelector('#chart-latency');
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

    // Chart 2: VPS Uptime & Blue/Green Failover Speed
    const uptimeEl = document.querySelector('#chart-uptime');
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
    const throughputEl = document.querySelector('#chart-throughput');
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
  });
})();
