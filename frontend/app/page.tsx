"use client";

import React, { useState } from "react";
import { Sliders, CheckCircle, ShieldCheck, Eye, EyeOff, FileText, Zap } from "lucide-react";

export default function SignatureStudio() {
  const [confThresh, setConfThresh] = useState(50);
  const [nmsThresh, setNmsThresh] = useState(45);
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedSignature, setSelectedSignature] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const sampleSignatures = [
    {
      id: "sig_1",
      name: "Alexander Hayes",
      conf: 96.2,
      bbox: [140, 1310, 480, 1420],
      dim: "340×110px",
    },
    {
      id: "sig_2",
      name: "Claire M. Sterling",
      conf: 94.1,
      bbox: [680, 1315, 1020, 1425],
      dim: "340×110px",
    },
  ];

  const handleVerify = (sig: any) => {
    setSelectedSignature(sig);
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult({
        status: "AUTHENTIC MATCH",
        score: 94.8,
        ssim: 0.921,
        densityDiff: 0.034,
        details: `Signature strokes align with enrolled exemplar for ${sig.name}. Stroke curvature and pen pressure distribution pass biometric baseline.`,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400 w-7 h-7" />
            Signature Intelligence Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            YOLOX-S ONNX Runtime · Anchor-Free Single-Class Detection & Biometric Verification
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" /> 18.4 ms Latency
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
            mAP@0.5: 0.9412
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Controls:</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-slate-300">Confidence Threshold:</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={confThresh}
                  onChange={(e) => setConfThresh(Number(e.target.value))}
                  className="w-24 accent-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-emerald-400 w-8">{confThresh}%</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-slate-300">NMS IoU Threshold:</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={nmsThresh}
                  onChange={(e) => setNmsThresh(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-blue-400 w-8">{nmsThresh}%</span>
              </div>
            </div>

            <button
              onClick={() => setShowBoxes(!showBoxes)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
            >
              {showBoxes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showBoxes ? "Hide Bounding Boxes" : "Show Bounding Boxes"}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative min-h-[450px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-2 font-medium text-slate-200">
                <FileText className="w-4 h-4 text-emerald-400" /> Commercial Lease Agreement (2 Signers)
              </span>
              <span>1200 × 1600 px · Skew Corrected (-2.4°)</span>
            </div>

            <div className="relative my-4 bg-slate-950 border border-slate-800 rounded-lg h-[350px] flex items-center justify-center overflow-hidden">
              <div className="text-center p-8 text-slate-600">
                <FileText className="w-16 h-16 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Document Stream Preview</p>
              </div>

              {showBoxes && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect x="15%" y="60%" width="30%" height="25%" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
                  <text x="16%" y="58%" fill="#10b981" fontSize="11" fontWeight="bold">Alexander Hayes (96.2%)</text>

                  <rect x="55%" y="60%" width="30%" height="25%" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
                  <text x="56%" y="58%" fill="#3b82f6" fontSize="11" fontWeight="bold">Claire M. Sterling (94.1%)</text>
                </svg>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Strides: 8, 16, 32 (8,400 Grid Cells Decoded)</span>
              <span>NMS IoU: {nmsThresh}% | Confidence: {confThresh}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center justify-between">
              <span>Extracted Signature Crops ({sampleSignatures.length})</span>
            </h3>

            <div className="space-y-4">
              {sampleSignatures.map((sig) => (
                <div key={sig.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{sig.name}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold rounded">
                      {sig.conf}% conf
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{sig.dim}</span>
                    <button
                      onClick={() => handleVerify(sig)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded transition"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedSignature && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-semibold text-slate-200 text-base">Signature Biometric Verification</h4>
              <button onClick={() => setSelectedSignature(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            {isVerifying ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400">Verifying SSIM Metrics...</p>
              </div>
            ) : (
              verificationResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                    <span className="text-xs font-bold text-emerald-400">{verificationResult.status}</span>
                    <span className="text-xs font-extrabold text-emerald-400">{verificationResult.score}%</span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800/80 leading-relaxed">
                    {verificationResult.details}
                  </p>
                  <button
                    onClick={() => setSelectedSignature(null)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}