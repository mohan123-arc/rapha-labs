const $ = (s) => document.querySelector(s);
const stepData = [
  ["Understand","We listen to your idea, goals, users and constraints before suggesting a solution."],
  ["Plan","We define the scope, key features, technology choices, milestones and expected timeline together."],
  ["Build","We develop the agreed solution in manageable stages and keep communication clear."],
  ["Test","We check the agreed features, identify issues and improve reliability before handover."],
  ["Deploy","We prepare the solution for its intended environment and help with the agreed deployment process."],
  ["Support","We provide the post-delivery guidance or support agreed in the project scope."]
];
document.querySelectorAll(".step").forEach((button) => {
  button.addEventListener("click", () => {
    const i = Number(button.dataset.step);
    document.querySelectorAll(".step").forEach((b) => {
      const active = b === button;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", String(active));
    });
    $("#stepNumber").textContent = `STEP ${String(i+1).padStart(2,"0")}`;
    $("#stepTitle").textContent = stepData[i][0];
    $("#stepDescription").textContent = stepData[i][1];
  });
});
const navLinks = $("#navLinks");
$("#menuToggle").addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
document.querySelectorAll("[data-service]").forEach(a => a.addEventListener("click", () => {
  const service = a.dataset.service;
  const select = $("#service");
  const match = [...select.options].find(o => o.text.toLowerCase().includes(service.toLowerCase().split(" ")[0]));
  if (match) select.value = match.value;
}));
$("#year").textContent = new Date().getFullYear();

const form = $("#enquiryForm");
const preview = $("#briefPreview");
function makeBrief() {
  const data = new FormData(form);
  const fields = [
    ["Enquiry type", data.get("customer_type")], ["Service", data.get("service")],
    ["Name", data.get("name")], ["Email", data.get("email")], ["Mobile", data.get("phone")],
    ["Institution", data.get("institution") || "Not provided"], ["Technology", data.get("technology") || "Open to suggestion"],
    ["Budget", data.get("budget")], ["Deadline", data.get("deadline") || "Not specified"],
    ["Requirements", data.get("idea")]
  ];
  preview.textContent = "RAPHA LABS — PROJECT ENQUIRY\n\n" + fields.map(([k,v]) => `${k}: ${v || "—"}`).join("\n");
  return preview.textContent;
}
form.addEventListener("input", makeBrief);
$("#copyBrief").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(makeBrief()); $("#copyBrief").textContent = "Copied!"; }
  catch { $("#copyBrief").textContent = "Select and copy preview"; }
  setTimeout(() => $("#copyBrief").textContent = "Copy brief", 1800);
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = $("#formStatus"), button = $("#submitBtn");
  status.textContent = "";
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form).entries());
  data.brief = makeBrief();
  if (!data.consent) { status.textContent = "Please provide consent before submitting."; return; }
  button.disabled = true; button.textContent = "Submitting…";
  try {
    const response = await fetch("/api/enquiries", {
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Submission failed.");
    status.textContent = `Thank you. Your enquiry was saved locally (reference ${result.reference}).`;
    form.reset(); makeBrief();
  } catch (error) {
    status.textContent = `${error.message} Make sure the Flask server is running, then try again.`;
  } finally {
    button.disabled = false; button.innerHTML = 'Submit enquiry <span>↗</span>';
  }
});

const dialog = $("#policyDialog");
function showPolicy(title, body) { $("#policyContent").innerHTML = `<h2>${title}</h2><p>${body}</p>`; dialog.showModal(); }
document.querySelectorAll('a[href="#privacy"],a[href="#terms"]').forEach(a => a.addEventListener("click", e => {
  e.preventDefault();
  if (a.hash === "#privacy") showPolicy("Privacy notice", "The local demo stores submitted enquiry details in data/enquiries.csv on the computer running the website. Keep this file private, restrict access to the laptop, and delete records when no longer needed. Before public launch, publish a reviewed privacy policy explaining the actual hosting, collection, retention, access and contact practices. Do not collect sensitive personal information through this form.");
  else showPolicy("Terms of use", "RAPHA Labs discusses each request before accepting work. A project begins only after scope, deliverables, pricing, timeline, responsibilities and support terms are agreed in writing. Service availability depends on team capacity. Website content is informational and does not constitute a guaranteed delivery commitment.");
}));
$("#closeDialog").addEventListener("click", () => dialog.close());
makeBrief();
