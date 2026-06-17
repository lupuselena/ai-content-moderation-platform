import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

type Post = {
  id: number;
  text: string;
  moderationStatus: string;
  createdAt: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  posts = signal<Post[]>([]);
  text = '';
  loading = false;
  error = '';
  isAuthenticated = signal(false);

  apiUrl = '/api/v1/posts';

  async ngOnInit() {
    await this.handleCognitoCallback();

    const token = localStorage.getItem('access_token');
    this.isAuthenticated.set(!!token);

    if (token) {
      await this.loadPosts();
    } else {
      this.error = 'Please login to see posts.';
    }
  }

  login() {
    window.location.href =
      `${environment.cognitoDomain}/oauth2/authorize` +
      `?client_id=${environment.cognitoClientId}` +
      `&response_type=code` +
      `&scope=openid%20email` +
      `&redirect_uri=http://localhost:4200`;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');

    this.posts.set([]);
    this.text = '';
    this.error = 'Please log in to view and manage moderated posts.';
    this.isAuthenticated.set(false);

    window.location.href =
      `${environment.cognitoDomain}/logout` +
      `?client_id=${environment.cognitoClientId}` +
      `&response_type=code` +
      `&scope=openid%20email` +
      `&redirect_uri=${encodeURIComponent('http://localhost:4200')}`;
  }

  private async handleCognitoCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) return;

    const response = await fetch('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      this.error = 'Login failed.';
      return;
    }

    const tokens = await response.json();
    localStorage.setItem('access_token', tokens.access_token);

    window.history.replaceState({}, document.title, '/');
  }

  async loadPosts() {
    const token = localStorage.getItem('access_token');

    const response = await fetch(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      this.error = `Failed to load posts: ${response.status}`;
      return;
    }

    const data = await response.json();
    this.posts.set(data);
    this.error = '';
  }

  async createPost() {
    if (!this.text.trim()) return;

    const token = localStorage.getItem('access_token');

    this.loading = true;

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: this.text }),
    });

    this.loading = false;

    if (!response.ok) {
      this.error = `Failed to create post: ${response.status}`;
      return;
    }

    this.text = '';
    await this.loadPosts();
  }
}