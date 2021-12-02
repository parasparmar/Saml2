using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TrySAML.Data;
using TrySAML.Services;
using Sustainsys.Saml2;
using Sustainsys.Saml2.Metadata;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Hosting;

namespace TrySAML
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddMvc()
                .AddRazorPagesOptions(options =>
                {
                    options.Conventions.AuthorizeFolder("/Account/Manage");
                    options.Conventions.AuthorizePage("/Account/Logout");
                });

            // Register no-op EmailSender used by account confirmation and password reset during development
            // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=532713
            services.AddSingleton<IEmailSender, EmailSender>();

            
            ConfigureSaml2Authentication(services);
        }

        private void ConfigureSaml2Authentication(IServiceCollection services)
        {
            /*  EKG_ADDS_NGC_DEV
             *  Application (client) ID 2046e1b5-fd9a-4fd0-9eb8-14333bc53a90
                Directory (tenant) ID e0b26355-1889-40d8-8ef1-e559616befda
            */
            var config = Configuration.GetSection("Saml2").GetSection("ServiceProviderOptions");
            services.AddAuthentication()
                .AddSaml2(options =>
                {                    
                    options.SPOptions.EntityId = new EntityId(config.GetValue<string>("EntityId"));
                    options.SPOptions.ReturnUrl = new Uri(config.GetValue<string>("ReturnUrl"));
                    options.SPOptions.WantAssertionsSigned = true;
                    options.SPOptions.ServiceCertificates.Add(new X509Certificate2(config.GetValue<string>("ServiceCertificates"), config.GetValue<string>("ServiceCertificatesPassword")));
                    config = Configuration.GetSection("Saml2").GetSection("IdentityProviders");
                    options.IdentityProviders.Add(
                        new IdentityProvider(
                            new EntityId(config.GetValue<string>("EntityId")), options.SPOptions)
                        {
                            LoadMetadata = true,
                            MetadataLocation = config.GetValue<string>("MetadataLocation"),
                            AllowUnsolicitedAuthnResponse = true,
                            SingleSignOnServiceUrl = new Uri(config.GetValue<string>("SingleSignOnServiceUrl")),
                        });
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });
        }
    }
}
