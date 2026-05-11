using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using System.Text.Json;
using backend.DTOs;

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace backend.Services;

public class DroneStatusService
{
    private readonly ConcurrentDictionary<string, DateTime> _lastSeen = new();

    private readonly ConcurrentDictionary<string, bool> _onlineStatus = new();

    public void UpdateActivity(string serialNumber)
    {
        if (string.IsNullOrWhiteSpace(serialNumber))
        {
            return;
        }

        var normalized = serialNumber.Trim();
        _lastSeen[normalized] = DateTime.UtcNow;
    }

    public List<(string SerialNumber, bool IsOnline, DateTime LastSeen)> GetStatusChanges(double timeoutSeconds)
    {
        var changes = new List<(string, bool, DateTime)>();
        foreach (var sn in _lastSeen.Keys)
        {
            if (!_lastSeen.TryGetValue(sn, out var lastSeen))
            {
                continue;
            }

            var isCurrentlyOnline = (DateTime.UtcNow - lastSeen).TotalSeconds < timeoutSeconds;

            if (!_onlineStatus.TryGetValue(sn, out var lastStatus) || lastStatus != isCurrentlyOnline)
            {
                _onlineStatus[sn] = isCurrentlyOnline;
                changes.Add((sn, isCurrentlyOnline, lastSeen));
            }
        }
        return changes;
    }
}