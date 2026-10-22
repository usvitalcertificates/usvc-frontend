"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  applicationSections,
  applicationCopyText,
  applicationFieldText,
  type ApplicationData,
  type ApplicationField,
} from "@/lib/form-config";
import { jurisdictionNoun, loadStateGeography, type StateGeography } from "@/lib/geo";
import { CopyButton } from "./CopyButton";

export function ApplicationSections({
  data,
  renderField,
  renderSensitive,
}: {
  data: ApplicationData;
  renderField?: (field: ApplicationField) => ReactNode;
  renderSensitive: (field: "ssn" | "card") => ReactNode;
}) {
  const [geo, setGeo] = useState<StateGeography>();
  useEffect(() => {
    let active = true;
    void loadStateGeography(data.stateCode).then((value) => {
      if (active) setGeo(value);
    });
    return () => {
      active = false;
    };
  }, [data.stateCode]);
  const sections = applicationSections(
    data,
    jurisdictionNoun(geo?.state === data.stateCode ? geo : undefined),
  );
  return (
    <div className="staff-application-sections">
      {sections.map((section) => {
        const text = section.groups
          .map((group) => {
            const values = applicationCopyText(group.fields);
            return values ? [group.title, values].filter(Boolean).join("\n") : "";
          })
          .filter(Boolean)
          .join("\n\n");
        return (
          <section key={section.key} className="staff-appsect" aria-label={section.title}>
            <div className="staff-secthead">
              <h2>
                {section.number}. {section.title}
              </h2>
              {!renderField && text ? (
                <CopyButton value={text} label={`${section.title} section`} />
              ) : null}
            </div>
            {section.groups.map((group, index) => (
              <div key={index} className="staff-application-group">
                {group.title ? <h3>{group.title}</h3> : null}
                {renderField ? (
                  group.fields.map((field) => (
                    <div key={field.path}>
                      {field.sensitive ? renderSensitive(field.sensitive) : renderField(field)}
                    </div>
                  ))
                ) : (
                  <>
                    {group.fields.some((field) => !field.sensitive) ? (
                      <dl className="staff-deflist">
                        {group.fields
                          .filter((field) => !field.sensitive)
                          .map((field) => (
                            <div key={field.path}>
                              <dt>{field.label}</dt>
                              <dd>
                                {field.value.trim() ? (
                                  <CopyButton
                                    value={applicationFieldText(field)}
                                    label={field.label}
                                    position="left"
                                  />
                                ) : null}
                                <span>
                                  {field.value.trim() ? applicationFieldText(field) : "—"}
                                </span>
                              </dd>
                            </div>
                          ))}
                      </dl>
                    ) : null}
                    {group.fields
                      .filter((field) => field.sensitive)
                      .map((field) => (
                        <div key={field.path}>{renderSensitive(field.sensitive!)}</div>
                      ))}
                  </>
                )}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
