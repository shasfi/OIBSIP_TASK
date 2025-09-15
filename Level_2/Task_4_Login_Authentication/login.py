import tkinter as tk
import json, re, os

USER_FILE = "users.json"

def load_users():
    if os.path.exists(USER_FILE):
        with open(USER_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f)

def is_valid_email(email):
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(regex, email)

def show_message(label, text, color="red"):
    label.config(text=text, fg=color)
    label.after(3000, lambda: label.config(text=""))

def secured_page(username):
    sec_win = tk.Toplevel()
    sec_win.title("Secured Page")
    sec_win.geometry("600x400")
    sec_win.configure(bg="#1a1a2e")
    tk.Label(sec_win, text=f"Welcome {username}!", font=("Helvetica", 24, "bold"), bg="#1a1a2e", fg="white").pack(pady=80)
    tk.Button(sec_win, text="Logout", bg="#e94560", fg="white", font=("Helvetica", 14), command=sec_win.destroy, padx=15, pady=10).pack()

# ----------------- Register/Login -----------------
def register_user():
    users = load_users()
    username = reg_username.get().strip()
    email = reg_email.get().strip()
    password = reg_password.get().strip()

    if not username or not email or not password:
        show_message(register_msg, "All fields required!")
        return
    if username in users:
        show_message(register_msg, "Username exists!")
        return
    if not is_valid_email(email):
        show_message(register_msg, "Invalid email format!")
        return
    if len(password) < 6:
        show_message(register_msg, "Password at least 6 chars!")
        return

    users[username] = {"email": email, "password": password}
    save_users(users)
    show_message(register_msg, f"'{username}' registered!", "green")
    reg_username.delete(0, tk.END)
    reg_email.delete(0, tk.END)
    reg_password.delete(0, tk.END)

def login_user():
    users = load_users()
    username = login_username.get().strip()
    password = login_password.get().strip()

    if username in users and users[username]["password"] == password:
        show_message(login_msg, f"Login successful! Welcome {username}", "green")
        secured_page(username)
    else:
        show_message(login_msg, "Invalid username or password!")

# ----------------- Frames Switch -----------------
def show_login():
    register_frame.pack_forget()
    login_frame.pack(pady=50)

def show_register():
    login_frame.pack_forget()
    register_frame.pack(pady=50)

# ----------------- Focus Highlight -----------------
def focus_effect(entry):
    def on_focus_in(e):
        entry.config(highlightthickness=2, highlightbackground="#6c5ce7", highlightcolor="#6c5ce7")
    def on_focus_out(e):
        entry.config(highlightthickness=0)
    entry.bind("<FocusIn>", on_focus_in)
    entry.bind("<FocusOut>", on_focus_out)

# ----------------- Button hover/press -----------------
def hover_effect(btn, bg="#6c5ce7", fg="white"):
    def on_enter(e):
        e.widget.config(bg=bg)
    def on_leave(e):
        e.widget.config(bg=btn.original_bg, fg=btn.original_fg)
    btn.bind("<Enter>", on_enter)
    btn.bind("<Leave>", on_leave)

def press_effect(btn):
    def on_press(e):
        e.widget.config(relief="sunken")
    def on_release(e):
        e.widget.config(relief="raised")
    btn.bind("<ButtonPress-1>", on_press)
    btn.bind("<ButtonRelease-1>", on_release)

# ----------------- Password Toggle -----------------
def toggle_password(entry, toggle_btn):
    if entry.cget("show") == "*":
        entry.config(show="")
        toggle_btn.config(text="Hide")
    else:
        entry.config(show="*")
        toggle_btn.config(text="Show")

# ----------------- Main Window -----------------
root = tk.Tk()
root.title("Professional Login/Register")
root.attributes("-fullscreen", True)
root.configure(bg="#f0f2f5")  # Soft gradient-like solid background

# Tabs
tab_frame = tk.Frame(root, bg="#f0f2f5")
tab_frame.pack(pady=20)
login_tab_btn = tk.Button(tab_frame, text="Login", width=20, font=("Helvetica", 12, "bold"), bg="#a29bfe", fg="white", command=show_login)
register_tab_btn = tk.Button(tab_frame, text="Register", width=20, font=("Helvetica", 12, "bold"), bg="#74b9ff", fg="white", command=show_register)
login_tab_btn.grid(row=0, column=0, padx=15)
register_tab_btn.grid(row=0, column=1, padx=15)

for btn in [login_tab_btn, register_tab_btn]:
    btn.original_bg = btn.cget("bg")
    btn.original_fg = btn.cget("fg")
    hover_effect(btn)
    press_effect(btn)

# Frames
login_frame = tk.Frame(root, bg="#f5f6fa")
register_frame = tk.Frame(root, bg="#f5f6fa")

# --- LOGIN FRAME ---
tk.Label(login_frame, text="Username or Email", bg="#f5f6fa", font=("Helvetica", 14)).pack(pady=10)
login_username = tk.Entry(login_frame, width=40, font=("Helvetica", 14))
login_username.pack(pady=10)
focus_effect(login_username)

tk.Label(login_frame, text="Password", bg="#f5f6fa", font=("Helvetica", 14)).pack(pady=10)
login_password = tk.Entry(login_frame, width=40, font=("Helvetica", 14), show="*")
login_password.pack(pady=10)
focus_effect(login_password)

login_toggle = tk.Button(login_frame, text="Show", command=lambda: toggle_password(login_password, login_toggle))
login_toggle.pack(pady=5)

login_btn = tk.Button(login_frame, text="Login", bg="#6c5ce7", fg="white", font=("Helvetica", 14), width=25, command=login_user)
login_btn.pack(pady=20)
login_btn.original_bg = login_btn.cget("bg")
login_btn.original_fg = login_btn.cget("fg")
hover_effect(login_btn)
press_effect(login_btn)

login_msg = tk.Label(login_frame, text="", bg="#f5f6fa", font=("Helvetica", 12))
login_msg.pack(pady=5)

# --- REGISTER FRAME ---
tk.Label(register_frame, text="Username", bg="#f5f6fa", font=("Helvetica", 14)).pack(pady=10)
reg_username = tk.Entry(register_frame, width=40, font=("Helvetica", 14))
reg_username.pack(pady=10)
focus_effect(reg_username)

tk.Label(register_frame, text="Email", bg="#f5f6fa", font=("Helvetica", 14)).pack(pady=10)
reg_email = tk.Entry(register_frame, width=40, font=("Helvetica", 14))
reg_email.pack(pady=10)
focus_effect(reg_email)

tk.Label(register_frame, text="Password", bg="#f5f6fa", font=("Helvetica", 14)).pack(pady=10)
reg_password = tk.Entry(register_frame, width=40, font=("Helvetica", 14), show="*")
reg_password.pack(pady=10)
focus_effect(reg_password)

reg_toggle = tk.Button(register_frame, text="Show", command=lambda: toggle_password(reg_password, reg_toggle))
reg_toggle.pack(pady=5)

register_btn = tk.Button(register_frame, text="Register", bg="#74b9ff", fg="white", font=("Helvetica", 14), width=25, command=register_user)
register_btn.pack(pady=20)
register_btn.original_bg = register_btn.cget("bg")
register_btn.original_fg = register_btn.cget("fg")
hover_effect(register_btn)
press_effect(register_btn)

register_msg = tk.Label(register_frame, text="", bg="#f5f6fa", font=("Helvetica", 12))
register_msg.pack(pady=5)

# Default
show_login()
root.mainloop()
