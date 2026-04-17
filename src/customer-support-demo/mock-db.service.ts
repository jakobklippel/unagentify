import { Injectable } from '@nestjs/common';
import {
  Customer,
  Device,
  KnowledgeBaseArticle,
  KnownIssue,
  Order,
  Product,
  Subscription,
  customers,
  devices,
  knowledgeBase,
  knownIssues,
  orders,
  products,
  subscriptions,
} from './data';

@Injectable()
export class MockDbService {
  // ── Customers ──

  findCustomerById(id: string): Customer | undefined {
    return customers.find((c) => c.id === id);
  }

  findCustomerByEmail(email: string): Customer | undefined {
    return customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  }

  searchCustomers(query: string): Customer[] {
    const q = query.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q),
    );
  }

  // ── Orders ──

  findOrderById(id: string): Order | undefined {
    return orders.find((o) => o.id === id);
  }

  findOrdersByCustomerId(customerId: string): Order[] {
    return orders.filter((o) => o.customerId === customerId);
  }

  // ── Products ──

  findProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
  }

  findProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
  }

  getAllProducts(): Product[] {
    return [...products];
  }

  // ── Subscriptions ──

  findSubscriptionById(id: string): Subscription | undefined {
    return subscriptions.find((s) => s.id === id);
  }

  findSubscriptionsByCustomerId(customerId: string): Subscription[] {
    return subscriptions.filter((s) => s.customerId === customerId);
  }

  // ── Devices ──

  findDeviceById(id: string): Device | undefined {
    return devices.find((d) => d.id === id);
  }

  findDevicesByCustomerId(customerId: string): Device[] {
    return devices.filter((d) => d.customerId === customerId);
  }

  findDevicesByProductId(productId: string): Device[] {
    return devices.filter((d) => d.productId === productId);
  }

  // ── Knowledge Base ──

  searchKnowledgeBase(query: string): KnowledgeBaseArticle[] {
    const q = query.toLowerCase();
    return knowledgeBase.filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.includes(q)) ||
        article.content.toLowerCase().includes(q),
    );
  }

  findKnowledgeBaseArticleById(id: string): KnowledgeBaseArticle | undefined {
    return knowledgeBase.find((a) => a.id === id);
  }

  getKnowledgeBaseByCategory(category: KnowledgeBaseArticle['category']): KnowledgeBaseArticle[] {
    return knowledgeBase.filter((a) => a.category === category);
  }

  // ── Known Issues ──

  findKnownIssuesByProductId(productId: string): KnownIssue[] {
    return knownIssues.filter((i) => i.productId === productId);
  }

  findKnownIssuesByFirmware(productId: string, firmwareVersion: string): KnownIssue[] {
    return knownIssues.filter((i) => i.productId === productId && i.affectedFirmware.includes(firmwareVersion));
  }

  getAllActiveKnownIssues(): KnownIssue[] {
    return knownIssues.filter((i) => i.status !== 'resolved');
  }
}
